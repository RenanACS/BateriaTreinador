#!/usr/bin/env python3
"""
Re-empacota os módulos-fonte de extracted/ de volta no manifesto do
drumio-standalone.html.

O HTML carrega cada módulo a partir de um manifesto JSON embutido, onde
cada entrada é { "mime", "compressed", "data": <base64 do gzip> }. A pasta
extracted/ contém o source legível de cada módulo (nome do arquivo = UUID).

Este script regrava o campo "data" de cada UUID com o conteúdo atual de
extracted/<uuid>, fazendo uma substituição cirúrgica (não reformata o resto
do manifesto). Rode após editar qualquer arquivo em extracted/.

Uso:
    python3 build.py            # re-empacota todos os módulos de texto
    python3 build.py <uuid>     # re-empacota só um módulo
    python3 build.py --check    # só verifica que o source bate com o HTML
"""
import base64
import gzip
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "drumio-standalone.html"
EXTRACTED = ROOT / "extracted"


def read_manifest(html: str) -> dict:
    m = re.search(r'<script type="__bundler/manifest">(.*?)</script>', html, re.S)
    if not m:
        raise SystemExit("manifesto não encontrado no HTML")
    return json.loads(m.group(1))


def gzip_b64(text: str) -> str:
    # mtime=0 deixa o gzip determinístico (diff mais limpo entre builds)
    raw = gzip.compress(text.encode("utf-8"), compresslevel=9, mtime=0)
    return base64.b64encode(raw).decode("ascii")


def replace_data(html: str, uuid: str, b64: str) -> str:
    # substitui só o valor "data" da entrada deste uuid. base64 não contém
    # aspas nem chaves, então o casamento é seguro.
    pat = re.compile(r'("' + re.escape(uuid) + r'":\s*\{[^}]*?"data":\s*")[^"]*(")')
    new_html, n = pat.subn(lambda m: m.group(1) + b64 + m.group(2), html)
    if n != 1:
        raise SystemExit(f"esperava 1 substituição para {uuid}, fiz {n}")
    return new_html


def main():
    args = sys.argv[1:]
    check_only = "--check" in args
    args = [a for a in args if a != "--check"]

    html = HTML.read_text(encoding="utf-8")
    manifest = read_manifest(html)

    # quais módulos: só os de texto (têm fonte legível em extracted/)
    targets = []
    for uuid, entry in manifest.items():
        src = EXTRACTED / uuid
        if not src.exists():
            continue
        try:
            src.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue  # binário (fonte, sample) — não mexer
        targets.append(uuid)

    if args:
        targets = [u for u in args if u in targets] or args

    changed = False
    for uuid in targets:
        src_text = (EXTRACTED / uuid).read_text(encoding="utf-8")
        entry = manifest[uuid]
        current = base64.b64decode(entry["data"])
        if entry.get("compressed"):
            current = gzip.decompress(current)
        current = current.decode("utf-8")
        if current == src_text:
            continue
        if check_only:
            print(f"DIVERGENTE: {uuid}")
            changed = True
            continue
        b64 = gzip_b64(src_text)
        # round-trip: garante que o que vamos gravar descomprime de volta ao source
        back = gzip.decompress(base64.b64decode(b64)).decode("utf-8")
        assert back == src_text, f"round-trip falhou para {uuid}"
        html = replace_data(html, uuid, b64)
        print(f"empacotado: {uuid} ({len(src_text)} chars)")
        changed = True

    if check_only:
        print("tudo em dia." if not changed else "há módulos divergentes (rode build.py).")
        return

    if changed:
        HTML.write_text(html, encoding="utf-8")
        print("drumio-standalone.html atualizado.")
    else:
        print("nada a fazer — HTML já está sincronizado.")


if __name__ == "__main__":
    main()
