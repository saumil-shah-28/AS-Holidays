#!/usr/bin/env bash
# Downloads all AS Holidays images/videos into public/media.
# Usage (from the project folder):   bash scripts/download-media.sh
# Optional: LOVABLE_HOST=your-site.lovable.app bash scripts/download-media.sh
set -u
cd "$(dirname "$0")/.." || exit 1
OUT=public/media; mkdir -p "$OUT"
HOST="${LOVABLE_HOST:-id-preview--c0a9ae1c-e107-40ea-9628-3eae3e48e38a.lovable.app}"
ok=0; fail=0; missing=()

get() { # get <file> <expected-type-prefix> <url>...
  local file=$1 type=$2; shift 2
  if [ -s "$OUT/$file" ]; then echo "✓ $file (already there)"; ok=$((ok+1)); return; fi
  for url in "$@"; do
    ct=$(curl -sSL --max-time 300 -o "$OUT/$file.part" -w '%{content_type}' "$url" 2>/dev/null)
    if [[ "$ct" == $type* ]] && [ -s "$OUT/$file.part" ]; then
      mv "$OUT/$file.part" "$OUT/$file"; echo "✓ $file  ←  $url"; ok=$((ok+1)); return
    fi
  done
  rm -f "$OUT/$file.part"; echo "✗ $file  (could not download)"; fail=$((fail+1)); missing+=("$file")
}
L="https://$HOST/__l5e/assets-v1"
U="https://images.unsplash.com"; Q="?w=1920&q=80&fm=jpg&fit=crop"

get as-holidays-logo.jpg image "$L/db19fad7-4d35-41c8-a0ba-42e83c2ae634/as-holidays-logo.jpg"
get bali.jpg        image "$L/3ffa4397-f223-41ab-9c03-70637b94eb81/bali.jpg"        "$U/photo-1537996194471-e657df975ab4$Q"
get maldives.jpg    image "$L/c5bc3650-23e8-43cf-b513-ca1aee648fe6/maldives.jpg"    "$U/photo-1507525428034-b723cf961d3e$Q"
get dubai.jpg       image "$L/de8b16cb-5f3e-4942-ab40-ad5e01e4080d/dubai.jpg"       "$U/photo-1512453979798-5ea266f8880c$Q"
get kashmir.jpg     image "$L/c2ef4e43-99f6-48f4-bda4-6be15cd01789/kashmir.jpg"     "$U/photo-1595815771614-ade9d652a65d$Q"
get kerala.jpg      image "$L/0af7a402-958f-43f6-8043-a91f6c013b57/kerala.jpg"      "$U/photo-1602216056096-3b40cc0c9944$Q"
get switzerland.jpg image "$L/32242c8e-fa16-46cc-ab02-7c3f7a3a1a30/switzerland.jpg" "$U/photo-1476514525535-07fb3b4ae5f1$Q"
get goa.jpg         image "$L/62103077-99a2-4025-954a-e9089947b370/goa.jpg"         "$U/photo-1512343879784-a960bf40e7f2$Q"
get rajasthan.jpg   image "$L/de0324b8-0712-4916-b808-7252f4b3d8e7/rajasthan.jpg"   "$U/photo-1599661046827-dacff0c0f09a$Q"
get thailand.jpg    image "$L/2e2e9f01-0ce8-449a-a12d-cb555757baf2/thailand.jpg"    "$U/photo-1528181304800-259b08848526$Q"
get singapore.jpg   image "$L/44337508-08f3-4340-b588-71f5c34656f3/singapore.jpg"   "$U/photo-1525625293386-3f8f99389edd$Q"
get manali.jpg      image "$L/97b0e2ab-b9cf-4d13-9d3c-c20390804574/manali.jpg"      "$U/photo-1626621341517-bbf3d9990a23$Q"
get vietnam.jpg     image "$L/8e9cc94c-d9f2-41da-908e-12065b5efdb3/vietnam.jpg"     "$U/photo-1528127269322-539801943592$Q"
get bali-banner.mp4  video "$L/ddfb9f66-bebf-4aab-8eb0-6b5b689b0aff/bali-banner.mp4" \
  "https://videos.pexels.com/video-files/8335344/8335344-hd_1920_1080_25fps.mp4" \
  "https://videos.pexels.com/video-files/8335344/8335344-uhd_4096_2160_25fps.mp4"
get bali-banner.webm video "$L/14823659-6b2e-421c-8b12-36a210847dd4/bali-banner.webm"

# If the webm couldn't be downloaded but ffmpeg is installed, make one from the mp4.
if [ ! -s "$OUT/bali-banner.webm" ] && [ -s "$OUT/bali-banner.mp4" ] && command -v ffmpeg >/dev/null; then
  echo "… creating bali-banner.webm with ffmpeg"
  ffmpeg -loglevel error -y -i "$OUT/bali-banner.mp4" -an -vf "scale=-2:1080" -c:v libvpx-vp9 -b:v 2M "$OUT/bali-banner.webm" && echo "✓ bali-banner.webm (converted)"
fi

echo; echo "Done: $ok downloaded, $fail failed."
if [ $fail -gt 0 ]; then
  echo "Missing: ${missing[*]}"
  echo "• bali-banner.webm is optional — the site falls back to the .mp4."
  echo "• For any other missing file, drop your own image into public/media/ with exactly that name."
fi
