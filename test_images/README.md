# Sample Test Images

This folder should contain sample injury images for testing the platform.

## Image Naming Convention

For best demo results, name your test images with keywords:

- `cut.jpg` or `wound.jpg` - Detects as CUT injury
- `burn.jpg` or `scald.jpg` - Detects as BURN injury
- `swelling.jpg` or `bump.jpg` - Detects as SWELLING
- `bruise.jpg` or `black.jpg` - Detects as BRUISE
- `fracture.jpg` or `bone.jpg` - Detects as FRACTURE
- `rash.jpg` or `itch.jpg` - Detects as RASH

## Where to Get Test Images

**Safe Sources:**
1. Stock photo websites (Unsplash, Pexels)
2. Medical education websites (with proper licensing)
3. Create mock images using photo editing

**Important:**
- DO NOT use real patient photos without consent
- Respect privacy and medical ethics
- Use only images appropriate for demonstration

## Example Setup

```bash
# Create test images folder
mkdir test_images

# Add your images
cp path/to/cut.jpg test_images/
cp path/to/burn.jpg test_images/
cp path/to/swelling.jpg test_images/
```

## Usage

When demoing:
1. Open scan page
2. Upload image from this folder
3. AI will detect based on filename
4. Show results and full flow

## Notes

- Images are stored in `backend/uploads/` when scanned
- Add `uploads/` to `.gitignore` to avoid committing images
- For production, implement proper image storage (S3, etc.)
