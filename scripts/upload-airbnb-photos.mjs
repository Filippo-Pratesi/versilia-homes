/**
 * Downloads Airbnb listing photos and uploads them to Supabase storage,
 * then inserts records into the property_photos table.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/upload-airbnb-photos.mjs
 */

const SUPABASE_URL = 'https://fyddhxapipreyxovwdtq.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

const PHOTO_DATA = [
  {
    slug: 'il-nido',
    propertyId: '7361e0c2-6a11-4854-adf2-6f39713c10ca',
    title: 'Il Nido',
    photos: [
      'https://a0.muscache.com/im/pictures/d64bfb55-ae57-413e-91e0-192117c71e70.jpg',
      'https://a0.muscache.com/im/pictures/8f2ea28f-6d89-47e3-8a44-b510dbdb230b.jpg',
      'https://a0.muscache.com/im/pictures/e241625f-5ad2-45ef-894c-9d4b14fde89f.jpg',
      'https://a0.muscache.com/im/pictures/04a05ee4-7e11-4ea4-80cb-870b903c9937.jpg',
      'https://a0.muscache.com/im/pictures/6f1f8df1-8ac1-47dd-b32e-dcd37c1b858c.jpg',
      'https://a0.muscache.com/im/pictures/c43b98dc-9787-4108-a996-baee3adf2128.jpg',
      'https://a0.muscache.com/im/pictures/d7192eaa-5aff-4f57-bbc5-a09e60386ab3.jpg',
      'https://a0.muscache.com/im/pictures/6f0da315-de0a-4bf0-8a05-2fb66e597b34.jpg',
      'https://a0.muscache.com/im/pictures/54ff5c20-8216-4000-9e85-47279e81bab7.jpg',
      'https://a0.muscache.com/im/pictures/af87592f-5683-4b38-8c35-3f54e2bb969f.jpg',
      'https://a0.muscache.com/im/pictures/3f3f3330-983f-40c8-a5f3-c7328cff3011.jpg',
      'https://a0.muscache.com/im/pictures/cc8bf27d-7219-4501-b514-553a9e0d9f7a.jpg',
    ],
  },
  {
    slug: 'la-pineta',
    propertyId: 'e9f35021-93f5-4a3a-9d05-041d73a6c757',
    title: 'La Pineta',
    photos: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/b24ea909-dd6c-4635-ba63-cc6714d9db44.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/b9cdb874-c8c9-4fed-82ae-02f7cf4b4fde.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/9abb048f-9680-4bf9-9b63-c15f06a9fdc0.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/35c3f2d5-8404-4ae4-96bf-22ab1dada685.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/3aa3031e-6dc8-4387-a6b0-4b8f444afe9e.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/19b32438-cdae-486f-8095-4c73ab2ae288.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/387e3c84-7440-443e-b845-c79baf890d09.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/061856c8-2cd4-4bb5-9161-17da969b0a3d.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/1a00c44e-ef88-46a8-b11d-bb996795c9d0.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/0362358e-f587-4cdf-acb0-85d821bd1161.jpeg',
      'https://a0.muscache.com/im/pictures/miso/Hosting-50289195/original/8ee7d802-c038-4d59-a469-305a37d82743.jpeg',
      'https://a0.muscache.com/im/pictures/aa44ec73-cb7b-4484-94c7-f72e10a52eb9.jpg',
      'https://a0.muscache.com/im/pictures/14e1f45a-76e5-4ff2-b4d4-92379d0f5e1a.jpg',
    ],
  },
  {
    slug: 'il-veliero',
    propertyId: '61ac2dfb-f89d-4952-8e92-806d1c1784fe',
    title: 'Il Veliero',
    photos: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/6837309f-9b4b-43d2-b85b-58af81ed763c.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/6af78f35-193d-489d-a4ce-37d16c593f96.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/bca4541c-c852-461a-bd1f-24b40f82adc5.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/7ae7e281-6ed5-490b-99cf-fd664050ab4a.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/c4ac64e5-d0d9-4c81-8725-f0adf98e25df.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/4d52e0f1-7027-4f8e-95b1-d4f02fb6ecbd.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/2dee6b13-0b8f-44a9-98b7-5b141a42fec1.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/2807d960-aad4-4dcd-b14b-4190ac6a4402.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/9710bbb5-3cea-4d88-9c66-f9ad78c7e5ae.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/ba90612e-136c-4d9d-8261-5056d3cb9b73.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/ab63c99a-eff4-4dc2-b885-9c13d67001b0.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/3f323cc2-4594-4c72-8b32-b721f1aa233e.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/4684c4f7-c259-44d2-80cb-90406214df3b.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/a117926a-6095-4902-b5d7-c6f506bc1a51.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/e02a24b9-9693-4407-8df5-ce88a76fed8b.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/6adfdcd1-b909-450d-bcc5-e484ee93de5c.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/fc9d4863-cb14-4841-998b-30343ddedc5b.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/61394414-50f4-4251-a6e5-0cf8e2a73944.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/cf905c0c-5481-4fbf-a242-bfa6a106ab34.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/0e3d7a46-ea58-4a78-8e6b-0186fe75f671.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/834676a2-4af7-4c7c-9669-b808a2c3cdc0.jpeg',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1181919578961612869/original/0afc09d3-2212-49f8-b76e-2616d0077fd9.jpeg',
    ],
  },
];

const headers = {
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  apikey: SERVICE_ROLE_KEY,
};

async function deleteExistingRecords() {
  console.log('Deleting existing property_photos records...');
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/property_photos?id=neq.00000000-0000-0000-0000-000000000000`,
    { method: 'DELETE', headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' } }
  );
  console.log('  DB delete status:', resp.status);
}

async function deleteStorageFiles(slug) {
  const listResp = await fetch(`${SUPABASE_URL}/storage/v1/object/list/property-photos`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: slug + '/', limit: 1000 }),
  });
  const files = await listResp.json();
  if (!Array.isArray(files) || files.length === 0) return;
  const paths = files.map(f => `${slug}/${f.name}`);
  await fetch(`${SUPABASE_URL}/storage/v1/object/property-photos`, {
    method: 'DELETE',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefixes: paths }),
  });
  console.log(`  Deleted ${paths.length} existing files from storage/${slug}`);
}

async function uploadPhoto(airbnbUrl, storagePath) {
  const imgResp = await fetch(airbnbUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  });
  if (!imgResp.ok) throw new Error(`Download failed: ${imgResp.status} ${airbnbUrl}`);

  const contentType = imgResp.headers.get('content-type') || 'image/jpeg';
  const buffer = await imgResp.arrayBuffer();

  const uploadResp = await fetch(`${SUPABASE_URL}/storage/v1/object/property-photos/${storagePath}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buffer,
  });

  if (!uploadResp.ok) {
    const body = await uploadResp.text();
    throw new Error(`Upload failed: ${uploadResp.status} ${body}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/property-photos/${storagePath}`;
}

async function insertPhotoRecords(records) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/property_photos`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(records),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`DB insert failed: ${resp.status} ${body}`);
  }
}

async function processProperty(prop) {
  console.log(`\nProcessing ${prop.title} (${prop.slug})...`);
  await deleteStorageFiles(prop.slug);

  const records = [];
  for (let i = 0; i < prop.photos.length; i++) {
    const airbnbUrl = prop.photos[i];
    const ext = 'jpg';
    const storagePath = `${prop.slug}/${String(i + 1).padStart(2, '0')}.${ext}`;
    try {
      const publicUrl = await uploadPhoto(airbnbUrl, storagePath);
      records.push({
        property_id: prop.propertyId,
        storage_path: storagePath,
        url: publicUrl,
        alt_text: `${prop.title} foto ${i + 1}`,
        sort_order: i,
        is_cover: i === 0,
      });
      console.log(`  [${i + 1}/${prop.photos.length}] Uploaded ${storagePath}`);
    } catch (err) {
      console.error(`  [${i + 1}/${prop.photos.length}] FAILED ${storagePath}: ${err.message}`);
    }
  }

  if (records.length > 0) {
    await insertPhotoRecords(records);
    console.log(`  Inserted ${records.length} records into property_photos`);
  }

  return records.length;
}

async function main() {
  console.log('=== Airbnb Photo Upload ===\n');
  await deleteExistingRecords();

  let total = 0;
  for (const prop of PHOTO_DATA) {
    total += await processProperty(prop);
  }

  console.log(`\n=== Done! Uploaded ${total} photos total ===`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
