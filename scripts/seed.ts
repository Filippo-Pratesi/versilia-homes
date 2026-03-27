import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PHOTOS_DIR = path.join(__dirname, "photos");

interface PropertySeed {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  location: string;
  guests_max: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  airbnb_listing_id: string;
  airbnb_url: string;
  rating: number;
  reviews_count: number;
  registration_code: string;
  sort_order: number;
}

const OWNERS = [
  {
    name: "Anna",
    email: "annaperazzo1@gmail.com",
    whatsapp_number: "+393398518814",
  },
  {
    name: "Filippo",
    email: "filippo301093@gmail.com",
    whatsapp_number: "+393486897408",
  },
];

const PROPERTIES: (PropertySeed & { owner_name: string })[] = [
  {
    owner_name: "Anna",
    slug: "la-casina-al-fresco",
    title: "La Casina al Fresco",
    subtitle: "Graziosa casetta indipendente in Versilia",
    description:
      "Graziosa casetta di nuova fattura che offre una comoda base di appoggio per chi vuole trascorrere un po' di tempo in Versilia. È situata in una zona molto tranquilla e con tutti i servizi utili nell'arco di 1Km, inoltre dista 700m dal mare il quale è facilmente raggiungibile a piedi attraversando la Pineta, il polmone verde di Viareggio. La Casina si sviluppa su di un piano openspace con cucina, divano letto matrimoniale e bagno. È presente un armadio ed una cassettiera. Lo spazio esterno è delimitato da due cancelli e riservato agli ospiti: adatto quindi ad animali. Possibilità di avere posto auto incluso. Biancheria su richiesta. Per soggiorni ≥ 7 giorni si offre servizio di pick-up dall'aeroporto di Pisa o dalle stazioni ferroviarie limitrofe.",
    location: "Viareggio, Toscana",
    guests_max: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [
      "Cucina",
      "WiFi",
      "Parcheggio gratuito",
      "Animali ammessi",
      "HDTV 24\"",
      "Spazio esterno recintato",
    ],
    airbnb_listing_id: "36871346",
    airbnb_url: "https://www.airbnb.it/rooms/36871346",
    rating: 4.44,
    reviews_count: 39,
    registration_code: "IT046033C2697BTUUG",
    sort_order: 0,
  },
  {
    owner_name: "Anna",
    slug: "seaside-apartment",
    title: "Seaside Apartment",
    subtitle: "Appartamento moderno vicino al mare",
    description:
      "Appartamento completamente ristrutturato e arredato, situato a pochi passi dal mare e dalla pineta. L'immobile è moderno, accogliente e dotato di tutto il necessario per trascorrere giornate rilassanti tra il mare della Versilia e le visite alle città toscane. È composto da una camera matrimoniale, una camera con letto a castello, un grande bagno, un soggiorno e una cucina con terrazza. Adatto a famiglie fino a 4 persone. Aria condizionata. Utenze escluse. Biancheria su richiesta. Si trova nel Quartiere Marco Polo, zona residenziale e centrale di Viareggio, a circa 600m dal mare.",
    location: "Viareggio, Toscana — Quartiere Marco Polo",
    guests_max: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Cucina",
      "WiFi",
      "Workspace dedicato",
      "Parcheggio gratuito su strada",
      "TV con cavo",
      "Aria condizionata",
      "Terrazza",
    ],
    airbnb_listing_id: "50289195",
    airbnb_url: "https://www.airbnb.com/rooms/50289195",
    rating: 5.0,
    reviews_count: 3,
    registration_code: "IT046033C2GI7I5Q5D",
    sort_order: 1,
  },
  {
    owner_name: "Filippo",
    slug: "appartamento-3-camere-mare",
    title: "Appartamento 3 camere a 500m dal mare",
    subtitle: "Ampio appartamento ristrutturato con ascensore",
    description:
      "Appartamento di recente ristrutturazione al secondo piano con ascensore, a 500 metri dal mare. Composto da soggiorno/cucina open-plan con penisola doppia, corridoio, 2 bagni, 2 ampie camere da letto matrimoniali, 1 camera media con letto a castello, e terrazza affacciata sul cortile interno. L'immobile è completamente LED, dotato di climatizzatori caldo/freddo in ogni stanza, piano cottura a induzione, lavastoviglie, Smart TV QLED 65\", tapparelle elettriche in alluminio, infissi PVC di ultima generazione e lavatrice.",
    location: "Viareggio, Toscana",
    guests_max: 7,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    amenities: [
      "Cucina",
      "WiFi",
      "Workspace dedicato",
      "TV QLED 65\"",
      "Ascensore",
      "Aria condizionata",
      "Piano cottura a induzione",
      "Lavastoviglie",
      "Lavatrice",
      "Tapparelle elettriche",
      "Terrazza",
    ],
    airbnb_listing_id: "1181919578961612869",
    airbnb_url:
      "https://www.airbnb.com/rooms/1181919578961612869",
    rating: 5.0,
    reviews_count: 5,
    registration_code: "IT046033C2VPQ5N62V",
    sort_order: 2,
  },
];

async function uploadPhotos(propertySlug: string, propertyId: string) {
  const photoDir = path.join(PHOTOS_DIR, propertySlug);
  const files = fs.readdirSync(photoDir).sort();
  const photoRecords: {
    property_id: string;
    storage_path: string;
    url: string;
    alt_text: string;
    sort_order: number;
    is_cover: boolean;
  }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(photoDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `${propertySlug}/${file}`;

    console.log(`  Uploading ${storagePath}...`);
    const { error } = await supabase.storage
      .from("property-photos")
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error(`  Error uploading ${storagePath}:`, error.message);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-photos").getPublicUrl(storagePath);

    photoRecords.push({
      property_id: propertyId,
      storage_path: storagePath,
      url: publicUrl,
      alt_text: `${propertySlug} foto ${i + 1}`,
      sort_order: i,
      is_cover: i === 0,
    });
  }

  if (photoRecords.length > 0) {
    const { error } = await supabase
      .from("property_photos")
      .insert(photoRecords);
    if (error) {
      console.error("  Error inserting photo records:", error.message);
    } else {
      console.log(`  Inserted ${photoRecords.length} photo records`);
    }
  }
}

async function main() {
  console.log("=== Seeding Versilia Booking Database ===\n");

  // 1. Insert owners
  console.log("1. Inserting owners...");
  const { data: ownerRows, error: ownerErr } = await supabase
    .from("owners")
    .upsert(OWNERS, { onConflict: "email", ignoreDuplicates: true })
    .select();

  if (ownerErr) {
    // email doesn't have unique constraint, try insert
    const { data: inserted, error: insertErr } = await supabase
      .from("owners")
      .insert(OWNERS)
      .select();
    if (insertErr) {
      console.error("Error inserting owners:", insertErr.message);
      process.exit(1);
    }
    console.log(`  Inserted ${inserted!.length} owners`);
    await seedProperties(inserted!);
  } else {
    console.log(`  Inserted ${ownerRows!.length} owners`);
    await seedProperties(ownerRows!);
  }
}

async function seedProperties(
  owners: { id: string; name: string; email: string }[]
) {
  // 2. Insert properties
  console.log("\n2. Inserting properties...");
  const ownerMap = new Map(owners.map((o) => [o.name, o.id]));

  for (const prop of PROPERTIES) {
    const ownerId = ownerMap.get(prop.owner_name);
    if (!ownerId) {
      console.error(`  Owner not found: ${prop.owner_name}`);
      continue;
    }

    const { owner_name, ...propData } = prop;
    const { data, error } = await supabase
      .from("properties")
      .insert({ ...propData, owner_id: ownerId })
      .select()
      .single();

    if (error) {
      console.error(`  Error inserting ${prop.slug}:`, error.message);
      continue;
    }
    console.log(`  Inserted property: ${data.title} (${data.id})`);

    // 3. Upload photos
    console.log(`\n3. Uploading photos for ${prop.slug}...`);
    await uploadPhotos(prop.slug, data.id);
  }

  // 4. Insert default pricing rules
  console.log("\n4. Inserting default pricing rules...");
  const { data: properties } = await supabase
    .from("properties")
    .select("id, slug");

  if (properties) {
    const pricingRules = properties.flatMap((p) => [
      {
        property_id: p.id,
        label: "Bassa stagione",
        price_per_night: p.slug === "appartamento-3-camere-mare" ? 120 : p.slug === "seaside-apartment" ? 80 : 50,
        is_default: true,
        min_nights: 2,
      },
      {
        property_id: p.id,
        label: "Alta stagione (Luglio-Agosto)",
        price_per_night: p.slug === "appartamento-3-camere-mare" ? 180 : p.slug === "seaside-apartment" ? 120 : 70,
        date_from: "2026-07-01",
        date_to: "2026-08-31",
        min_nights: 7,
        is_default: false,
      },
    ]);

    const { error } = await supabase
      .from("pricing_rules")
      .insert(pricingRules);
    if (error) {
      console.error("  Error inserting pricing rules:", error.message);
    } else {
      console.log(`  Inserted ${pricingRules.length} pricing rules`);
    }
  }

  console.log("\n=== Seed complete! ===");
}

main().catch(console.error);
