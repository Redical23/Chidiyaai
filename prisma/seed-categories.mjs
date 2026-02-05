// Seed script for Category Templates
// Run with: npx ts-node prisma/seed-categories.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Category template definitions with specifications
const categoryTemplates = [
    {
        name: "Paper Cups",
        slug: "paper-cups",
        description: "Disposable paper cups for beverages",
        specifications: [
            {
                name: "Capacity",
                key: "capacity",
                type: "single",
                important: true,
                options: ["65 ml (2.2 oz)", "80 ml (2.7 oz)", "90 ml (3 oz)", "100 ml (3.4 oz)", "150 ml (5 oz)", "210 ml (7 oz)", "250 ml (8.5 oz)", "300 ml (10 oz)", "350 ml (12 oz)", "Other"]
            },
            {
                name: "Paper GSM",
                key: "paper_gsm",
                type: "single",
                important: true,
                options: ["165 GSM", "170 GSM", "180 GSM", "190 GSM", "200 GSM", "225 GSM", "265 GSM", "300 GSM", "Other"]
            },
            {
                name: "Wall Type",
                key: "wall_type",
                type: "single",
                important: true,
                options: ["Single Wall", "Double Wall", "Ripple Wall", "Other"]
            },
            {
                name: "Design",
                key: "design",
                type: "single",
                important: false,
                options: ["Plain", "Generic Print", "Customized Print", "Other"]
            },
            {
                name: "Lid Option",
                key: "lid_option",
                type: "single",
                important: false,
                options: ["Without Lid", "With Lid", "Other"]
            },
            {
                name: "Paper Type",
                key: "paper_type",
                type: "single",
                important: false,
                options: ["White Paper", "Kraft Paper", "Other"]
            },
            {
                name: "Usage",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Hot Beverages", "Cold Beverages", "Ice Cream/Dessert", "Water"]
            },
            {
                name: "Coating Type",
                key: "coating_type",
                type: "single",
                important: false,
                options: ["PE Coated", "PLA Coated", "Aqueous Coated", "Bio PBS Coated"]
            },
            {
                name: "Features",
                key: "features",
                type: "multi",
                important: false,
                options: ["Recyclable", "Biodegradable", "Compostable", "Eco-Friendly"]
            },
            {
                name: "Top Diameter",
                key: "top_diameter",
                type: "single",
                important: false,
                options: ["58 mm", "62 mm", "70 mm", "73 mm", "80 mm", "90 mm"]
            }
        ]
    },
    {
        name: "Corrugated Box",
        slug: "corrugated-box",
        description: "Corrugated cardboard boxes for packaging",
        specifications: [
            {
                name: "Ply Count",
                key: "ply_count",
                type: "single",
                important: true,
                options: ["3 Ply", "5 Ply", "7 Ply", "9 Ply", "Other"]
            },
            {
                name: "Box Style",
                key: "box_style",
                type: "single",
                important: true,
                options: ["Regular Slotted", "Mailer / Die-Cut", "Top and Bottom", "Full Overlap (FOL)", "Half Slotted (HSC)", "Other"]
            },
            {
                name: "Weight Capacity",
                key: "weight_capacity",
                type: "single",
                important: true,
                options: ["Upto 3 kg", "Upto 5 kg", "Upto 10 kg", "Upto 15 kg", "Upto 25 kg", "Above 25 kg", "Other"]
            },
            {
                name: "Board Grade (GSM)",
                key: "board_gsm",
                type: "single",
                important: false,
                options: ["120 GSM", "140 GSM", "150 GSM", "180 GSM", "200 GSM", "250 GSM", "300 GSM", "Other"]
            },
            {
                name: "Paper Type",
                key: "paper_type",
                type: "single",
                important: false,
                options: ["Kraft Paper", "Virgin Kraft Paper", "Semi Kraft Paper", "Duplex Paper", "Other"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["Brown", "White", "Black", "Multi-Color", "Other"]
            },
            {
                name: "Flute Type",
                key: "flute_type",
                type: "single",
                important: false,
                options: ["A Flute", "B Flute", "C Flute", "E Flute", "F Flute", "BC Flute", "Other"]
            },
            {
                name: "Printing Type",
                key: "printing_type",
                type: "single",
                important: false,
                options: ["Plain", "Single Color", "Multi Color", "Flexo Printing", "Offset Printing", "Digital Printing"]
            },
            {
                name: "Application",
                key: "application",
                type: "multi",
                important: false,
                options: ["E-commerce", "Industrial", "Food Packaging", "Electronics", "Pharmaceutical", "Logistics", "Retail"]
            },
            {
                name: "Feature",
                key: "feature",
                type: "multi",
                important: false,
                options: ["Eco-Friendly", "Recyclable", "Heavy Duty", "Moisture Resistant", "Custom Printed", "High Strength"]
            }
        ]
    },
    {
        name: "Packaging Materials",
        slug: "packaging-materials",
        description: "General packaging materials including pouches, bags, rolls",
        specifications: [
            {
                name: "Material",
                key: "material",
                type: "single",
                important: true,
                options: ["Plastic", "Paper", "Corrugated Board", "PET", "PP", "HDPE", "Aluminum Foil", "Other"]
            },
            {
                name: "Product Type",
                key: "product_type",
                type: "single",
                important: true,
                options: ["Pouch", "Bag", "Box", "Roll", "Sheet", "Filler", "Liner", "Preform", "Other"]
            },
            {
                name: "Size",
                key: "size",
                type: "single",
                important: false,
                options: ["10x12 in", "12x16 in", "8x10 in", "6x8 in", "14x18 in", "7x9 in", "16x20 in", "Other"]
            },
            {
                name: "Usage / Application",
                key: "usage",
                type: "multi",
                important: true,
                options: ["E-commerce", "Food Packaging", "Apparel", "Industrial", "Pharmaceutical", "Gifting", "Shipping", "Other"]
            },
            {
                name: "Closure Type",
                key: "closure_type",
                type: "single",
                important: false,
                options: ["Heat Seal", "Adhesive Flap", "Zipper", "Spout Cap", "None", "Other"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["Transparent", "White", "Brown", "Black", "Multi-Color", "Silver", "Blue", "Red"]
            },
            {
                name: "Print & Pattern",
                key: "print_pattern",
                type: "single",
                important: false,
                options: ["Plain", "Branded", "Printed"]
            },
            {
                name: "Special Features",
                key: "special_features",
                type: "multi",
                important: false,
                options: ["Waterproof", "Tamper-Evident", "Resealable", "With POD Pocket", "With Air Bubble", "Biodegradable"]
            },
            {
                name: "Number of Layers",
                key: "layers",
                type: "single",
                important: false,
                options: ["Single Layer", "2-Ply", "3-Ply", "5-Ply", "7-Ply"]
            }
        ]
    },
    {
        name: "Cotton Textile",
        slug: "cotton-textile",
        description: "Cotton based textiles and fabrics",
        specifications: [
            {
                name: "Material",
                key: "material",
                type: "single",
                important: true,
                options: ["100% Cotton", "Combed Cotton", "Carded Cotton", "Organic Cotton", "Cotton Lycra", "Cotton Polyester", "Cotton Viscose", "Cotton Linen", "Slub Cotton", "Bamboo Cotton", "Other"]
            },
            {
                name: "Construction",
                key: "construction",
                type: "single",
                important: true,
                options: ["Poplin", "Cambric", "Voile", "Twill", "Satin", "Sheeting", "Drill", "Flannel", "Denim", "Terry", "Other"]
            },
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["60–80 gsm", "81–100 gsm", "101–130 gsm", "131–160 gsm", "161–200 gsm", "201–250 gsm", "251–300 gsm", "Above 300 gsm", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: false,
                options: ["36 in", "44 in", "48 in", "52 in", "58 in", "60 in", "63 in", "72 in", "90 in", "120 in", "Other"]
            },
            {
                name: "Usage",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Shirt", "Kurta", "Saree", "Bed Sheet", "Pillow Cover", "Towel", "Kurti", "Kids Wear", "Uniform", "Hospital Linen", "Other"]
            },
            {
                name: "Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["Plain", "Printed", "Checks", "Stripes", "Dobby", "Jacquard", "Yarn Dyed", "Embroidered", "Digital Print", "Floral", "Other"]
            },
            {
                name: "Finish",
                key: "finish",
                type: "multi",
                important: false,
                options: ["Greige", "Bleached", "Dyed", "Mercerised", "Peach Finish", "Brushed", "Bio Wash", "Sanforized", "Water Repellent", "Fire Retardant"]
            },
            {
                name: "Yarn Count",
                key: "yarn_count",
                type: "single",
                important: false,
                options: ["20s", "30s", "40s", "50s", "60s", "80s", "100s"]
            }
        ]
    },
    {
        name: "Cotton Fabric",
        slug: "cotton-fabric",
        description: "Cotton fabrics for garments and home textiles",
        specifications: [
            {
                name: "Fabric Type",
                key: "fabric_type",
                type: "single",
                important: true,
                options: ["Cambric", "Poplin", "Voile", "Mulmul", "Slub", "Dobby", "Satin", "Single Jersey", "Fleece", "Sinker", "Other"]
            },
            {
                name: "Quality / Construction",
                key: "quality",
                type: "single",
                important: true,
                options: ["60x60", "40x40", "80x80", "92x80", "50x50 PC", "2/60x40", "100x120", "30s Combed", "25s Combed", "Other"]
            },
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["160-180 gsm", "180-200 gsm", "200-220 gsm", "220-240 gsm", "120-140 gsm", "90-110 gsm", "250-300 gsm", "300-350 gsm", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: false,
                options: ["44 inch (112 cm)", "58 inch (147 cm)", "42 inch (107 cm)", "60 inch (152 cm)", "38 inch (96 cm)", "36 inch (91 cm)", "Other"]
            },
            {
                name: "Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["Printed", "Plain/Solid", "Yarn Dyed", "Embroidered", "Self Design", "Other"]
            },
            {
                name: "Composition",
                key: "composition",
                type: "single",
                important: false,
                options: ["100% Cotton", "Poly-Cotton (PC)", "Cotton Lycra", "Cotton Viscose", "Organic Cotton", "Cotton Tencel", "Other"]
            },
            {
                name: "Use / Application",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Kurti/Kurta", "Shirting", "Dress Material", "Bottom Wear", "T-shirt Fabric", "Nighty", "Bed Sheet", "Lining/Astar"]
            },
            {
                name: "Print Technique",
                key: "print_technique",
                type: "single",
                important: false,
                options: ["Screen Print", "Hand Block Print", "Digital Print", "Foil Print", "Rotary Print", "Rotion Print"]
            },
            {
                name: "Color",
                key: "color",
                type: "multi",
                important: false,
                options: ["White", "RFD", "Black", "Blue", "Red", "Yellow", "Green", "Pink"]
            },
            {
                name: "Finish",
                key: "finish",
                type: "multi",
                important: false,
                options: ["Bio-Wash", "Mill Dyed", "Soft Flow", "Bleached", "Mercerized"]
            }
        ]
    },
    {
        name: "Embroidered Fabrics",
        slug: "embroidered-fabrics",
        description: "Embroidered and decorated fabrics",
        specifications: [
            {
                name: "Fabric Type",
                key: "fabric_type",
                type: "single",
                important: true,
                options: ["Rayon", "Cotton", "Georgette", "Viscose", "PC Cotton", "Cotton Cambric", "Organza", "Silk", "Net", "Chambray", "Other"]
            },
            {
                name: "Work Type",
                key: "work_type",
                type: "single",
                important: true,
                options: ["Chikankari", "Schiffli", "Hakoba", "Sequence", "Crochet", "Thread Work", "Mirror Work", "Digital Print", "Other"]
            },
            {
                name: "Fabric Width (Panna)",
                key: "width",
                type: "single",
                important: false,
                options: ["44 inch", "58 inch", "48 inch", "60 inch", "56 inch", "52 inch", "42 inch", "38 inch", "Other"]
            },
            {
                name: "Ideal For",
                key: "ideal_for",
                type: "multi",
                important: false,
                options: ["Kurtis", "Kurtas", "Dresses", "Gowns", "Plazos", "Lehengas", "Sherwanis", "Blouses", "Tops", "Dupattas", "Other"]
            },
            {
                name: "Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["All Over", "Daman (Border)", "Buti (Motifs)", "Panel", "Center Panel", "Other"]
            },
            {
                name: "Embellishments",
                key: "embellishments",
                type: "multi",
                important: false,
                options: ["Sequins", "Mirror", "Thread", "Zari", "Golden Sequence", "White Dhaga", "Cutwork"]
            },
            {
                name: "Color",
                key: "color",
                type: "multi",
                important: false,
                options: ["White", "Black", "Red", "Blue", "Pink", "Green", "Yellow", "Off-White", "Greige", "Pastel Shades"]
            },
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: false,
                options: ["80-120", "121-160", "161-200", "201+"]
            },
            {
                name: "Dyeable",
                key: "dyeable",
                type: "single",
                important: false,
                options: ["Yes", "No"]
            }
        ]
    },
    {
        name: "Woven Fabrics",
        slug: "woven-fabrics",
        description: "Woven textile fabrics",
        specifications: [
            {
                name: "Material",
                key: "material",
                type: "single",
                important: true,
                options: ["Cotton", "Polyester", "PC Blend", "PV Blend", "Viscose", "Nylon", "Silk", "Linen", "Hemp", "Rayon", "Other"]
            },
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["85 GSM", "110 GSM", "120 GSM", "140 GSM", "160 GSM", "180 GSM", "210 GSM", "240 GSM", "280 GSM", "300 GSM", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: true,
                options: ["58 inch (147 cm)", "44 inch (112 cm)", "60 inch (152 cm)", "36 inch (91 cm)", "56 inch (142 cm)", "63 inch (160 cm)", "57 inch (145 cm)", "40 inch (101 cm)", "Other"]
            },
            {
                name: "Weave Type",
                key: "weave_type",
                type: "single",
                important: false,
                options: ["Plain", "Twill", "Satin", "Dobby", "Oxford", "Jacquard", "Ribstop", "Drill", "Other"]
            },
            {
                name: "Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["Solid", "Printed", "Checks", "Stripes", "Embroidered", "Yarn Dyed", "Digital Print", "Other"]
            },
            {
                name: "Fabric Type",
                key: "fabric_type",
                type: "single",
                important: false,
                options: ["Poplin", "Organza", "Satin", "Georgette", "Crepe", "Canvas", "Taffeta", "Velvet", "Chambray", "Muslin"]
            },
            {
                name: "Use",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Apparel", "Shirting", "Kurti/Dress", "Uniform", "Saree", "Garments", "Home Furnishing", "Industrial"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["White", "Black", "Blue", "Red", "Green", "Grey", "Pink", "Yellow", "Gold", "Silver"]
            },
            {
                name: "Special Finish",
                key: "special_finish",
                type: "multi",
                important: false,
                options: ["Dyed", "Coated", "Laminated", "Water Repellent", "Mechanical Stretch", "Quick Dry", "Anti Microbial", "Flame Retardant"]
            }
        ]
    },
    {
        name: "Fleece Fabric",
        slug: "fleece-fabric",
        description: "Fleece and sweatshirt fabrics",
        specifications: [
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["280 GSM", "300 GSM", "320 GSM", "260 GSM", "340 GSM", "240 GSM", "380 GSM", "400 GSM", "Other"]
            },
            {
                name: "Composition",
                key: "composition",
                type: "single",
                important: true,
                options: ["PC (Poly-Cotton)", "Spun (Polyester)", "Cotton", "Cotton Blended", "Recycled", "Other"]
            },
            {
                name: "Thread Count",
                key: "thread_count",
                type: "single",
                important: true,
                options: ["3-Thread", "2-Thread", "Other"]
            },
            {
                name: "Fabric Type",
                key: "fabric_type",
                type: "single",
                important: false,
                options: ["Polar Fleece", "Spun Fleece", "Sherpa Fleece", "Coral Fleece", "Russian Fleece", "Microfleece", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: false,
                options: ["60 inch", "42 inch", "38 inch", "72 inch", "58 inch", "84 inch", "96 inch", "Other"]
            },
            {
                name: "Features",
                key: "features",
                type: "multi",
                important: false,
                options: ["Anti-Pilling", "Brushed", "Bonded", "Printed", "Water Repellent", "Lycra", "Other"]
            },
            {
                name: "Usage",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Hoodies", "Sweatshirts", "Jackets", "Tracksuits", "Blankets", "Soft Toys"]
            },
            {
                name: "Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["Plain", "Printed", "Checks", "Stripes"]
            },
            {
                name: "Sided",
                key: "sided",
                type: "single",
                important: false,
                options: ["One-Sided", "Double-Sided"]
            }
        ]
    },
    {
        name: "Suiting and Shirting Fabric",
        slug: "suiting-shirting",
        description: "Fabrics for suits, shirts and formal wear",
        specifications: [
            {
                name: "Fabric Type / Material",
                key: "material",
                type: "single",
                important: true,
                options: ["Polyester Viscose", "Polyester Cotton", "100% Cotton", "100% Polyester", "TR (Terry Rayon)", "Poly Wool", "Linen Blend", "Cotton Lycra", "Other"]
            },
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["220-280 GSM", "281-340 GSM", "161-220 GSM", "> 340 GSM", "120-160 GSM", "< 120 GSM", "Other"]
            },
            {
                name: "Use / Application",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Shirting", "Suiting", "Trouser Fabric", "Uniform", "Kurta Fabric", "Gifting", "Other"]
            },
            {
                name: "Weave / Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["Plain", "Twill", "Checks", "Stripes", "Satin", "Dobby", "Poplin", "Oxford", "Matty", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: false,
                options: ["147 cm (58 Inch)", "89 cm (35 Inch)", "112 cm (44 Inch)", "Other"]
            },
            {
                name: "Product Form",
                key: "product_form",
                type: "single",
                important: false,
                options: ["Combo Pack", "Fabric Roll (Thaan)"]
            },
            {
                name: "Brand",
                key: "brand",
                type: "single",
                important: false,
                options: ["Raymond", "Siyaram's", "Mafatlal", "Gwalior", "Reid & Taylor", "Vimal", "Qmax", "Murarka", "Sanmati"]
            },
            {
                name: "Feature",
                key: "feature",
                type: "multi",
                important: false,
                options: ["Stretch (Lycra)", "Wrinkle-Resistant", "Water Repellent", "Anti-Bacterial"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["Blue", "Black", "Grey", "White", "Khaki", "Cream", "Brown", "Beige"]
            }
        ]
    },
    {
        name: "Polyester Fabric",
        slug: "polyester-fabric",
        description: "Polyester based fabrics",
        specifications: [
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["160 gsm", "180 gsm", "220 gsm", "120 gsm", "140 gsm", "110 gsm", "200 gsm", "250 gsm", "300 gsm", "100 gsm", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: true,
                options: ["58 inch", "60 inch", "44 inch", "42 inch", "36 inch", "54 inch", "72 inch", "30 inch", "Other"]
            },
            {
                name: "Fabric Type",
                key: "fabric_type",
                type: "single",
                important: false,
                options: ["Knit", "Twill", "Crepe", "Satin", "Fleece", "Net", "Organza", "Jacquard", "Dobby", "Georgette", "Other"]
            },
            {
                name: "Composition",
                key: "composition",
                type: "single",
                important: false,
                options: ["100% Polyester", "Poly Spandex", "Poly Cotton (PC)", "Poly Viscose (PV)", "Other"]
            },
            {
                name: "Usage",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Sportswear", "T-shirts", "Lowers/Trackpants", "Garments", "Dress Material", "Uniforms", "Nightwear", "Bags", "Upholstery", "Linings"]
            },
            {
                name: "Finish",
                key: "finish",
                type: "multi",
                important: false,
                options: ["Stretch", "Printed", "Embossed", "Soft Feel", "Dri-Fit", "Waterproof", "Foil Print", "Wrinkle-free", "Anti-microbial", "UV Protect"]
            },
            {
                name: "Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["Plain", "Printed", "Melange", "Striped", "Checks", "Dotted"]
            }
        ]
    },
    {
        name: "Silk Woven Fabric",
        slug: "silk-woven-fabric",
        description: "Silk and art silk woven fabrics",
        specifications: [
            {
                name: "Material",
                key: "material",
                type: "single",
                important: true,
                options: ["Pure Silk", "Art Silk", "Silk Cotton (Sico)", "Tussar Silk", "Modal Silk", "Muga Silk", "Viscose Silk", "Other"]
            },
            {
                name: "Weight (GSM)",
                key: "gsm",
                type: "single",
                important: true,
                options: ["60 GSM", "55 GSM", "70 GSM", "80 GSM", "90 GSM", "65 GSM", "50 GSM", "95 GSM", "75 GSM", "125 GSM", "Other"]
            },
            {
                name: "Fabric Type",
                key: "fabric_type",
                type: "single",
                important: false,
                options: ["Georgette", "Crepe", "Satin", "Organza", "Chiffon", "Chanderi", "Raw Silk", "Muslin", "Tabby", "Tissue", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: false,
                options: ["44 inch", "58 inch", "42 inch", "48 inch", "60 inch", "Other"]
            },
            {
                name: "Weave Type",
                key: "weave_type",
                type: "single",
                important: false,
                options: ["Plain / Tabby", "Satin", "Crepe", "Jacquard / Brocade", "Twill", "Other"]
            },
            {
                name: "Pattern",
                key: "pattern",
                type: "multi",
                important: false,
                options: ["Jari / Zari", "Brocade", "Ikat", "Stripes", "Floral", "Buti / Butidar", "Checks", "Border"]
            },
            {
                name: "Fabric Form",
                key: "fabric_form",
                type: "single",
                important: false,
                options: ["Greige Fabric", "Dyed Fabric", "RFD Fabric"]
            },
            {
                name: "Origin",
                key: "origin",
                type: "single",
                important: false,
                options: ["Banarasi", "Bhagalpuri", "Pochampally", "Chanderi", "Surat", "Kanchipuram", "Uppada", "Paithani"]
            },
            {
                name: "Yarn Count",
                key: "yarn_count",
                type: "single",
                important: false,
                options: ["40x40", "60x60", "30x30", "50x50"]
            }
        ]
    },
    {
        name: "Cotton (Raw)",
        slug: "cotton-raw",
        description: "Raw cotton, cotton bales and cotton waste",
        specifications: [
            {
                name: "Cotton Type",
                key: "cotton_type",
                type: "single",
                important: true,
                options: ["Raw Cotton", "Ginned Cotton", "Cotton Bale", "Cotton Lint", "Cotton Linter", "Comber Noil", "Cotton Waste", "Other"]
            },
            {
                name: "Cotton Variety",
                key: "variety",
                type: "single",
                important: true,
                options: ["Shankar 6", "MCU 5", "Bunny BT", "MECH 1", "DCH 32", "J 34", "Hybrid", "Desi", "Other"]
            },
            {
                name: "Staple Length",
                key: "staple_length",
                type: "single",
                important: true,
                options: ["Below 23 mm", "23–25 mm", "26–28 mm", "29–30 mm", "31–32 mm", "Above 32 mm", "Other"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["White", "Off White", "Cream", "Grey", "Brown", "Green", "Mixed Assorted", "Other"]
            },
            {
                name: "Ginning Type",
                key: "ginning_type",
                type: "single",
                important: false,
                options: ["Roller Ginned", "Saw Ginned", "Unginned", "Other"]
            },
            {
                name: "Trash Content",
                key: "trash_content",
                type: "single",
                important: false,
                options: ["Below 2%", "2–4%", "4–6%", "6–8%", "Above 8%", "Other"]
            },
            {
                name: "Moisture Content",
                key: "moisture",
                type: "single",
                important: false,
                options: ["Below 8%", "8–10%", "10–12%", "12–14%", "Above 14%"]
            },
            {
                name: "Organic Status",
                key: "organic_status",
                type: "single",
                important: false,
                options: ["Conventional", "Organic"]
            },
            {
                name: "Usage",
                key: "usage",
                type: "multi",
                important: false,
                options: ["Ring Spinning", "Open End", "Blending", "Nonwoven", "Export", "Filling"]
            },
            {
                name: "Origin State",
                key: "origin_state",
                type: "single",
                important: false,
                options: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Punjab", "Rajasthan", "Haryana", "Madhya Pradesh"]
            }
        ]
    },
    {
        name: "Bubble Wrap",
        slug: "bubble-wrap",
        description: "Bubble wrap and air cushion packaging",
        specifications: [
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["40 GSM", "50 GSM", "35 GSM", "60 GSM", "30 GSM", "70 GSM", "20 GSM", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: true,
                options: ["1 m", "0.5 m", "1.5 m", "1.2 m", "Other"]
            },
            {
                name: "Length",
                key: "length",
                type: "single",
                important: false,
                options: ["100 m", "80 m", "50 m", "Other"]
            },
            {
                name: "Bubble Diameter",
                key: "bubble_diameter",
                type: "single",
                important: false,
                options: ["10 mm", "25 mm", "30 mm", "Other"]
            },
            {
                name: "Material",
                key: "material",
                type: "single",
                important: false,
                options: ["Polyethylene"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["Transparent", "Pink"]
            },
            {
                name: "Features",
                key: "features",
                type: "multi",
                important: false,
                options: ["Antistatic (ESD)"]
            }
        ]
    },
    {
        name: "BOPP Tapes",
        slug: "bopp-tapes",
        description: "BOPP adhesive tapes for packaging",
        specifications: [
            {
                name: "Width",
                key: "width",
                type: "single",
                important: true,
                options: ["48 mm (2 inch)", "72 mm (3 inch)", "24 mm (1 inch)", "12 mm (0.5 inch)", "36 mm (1.5 inch)", "60 mm (2.5 inch)", "96 mm (4 inch)", "Other"]
            },
            {
                name: "Length",
                key: "length",
                type: "single",
                important: true,
                options: ["65 m", "50 m", "100 m", "40 m", "45 m", "200 m", "300 m", "130 m", "30 m", "20 m", "Other"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["Transparent", "Brown", "White", "Red", "Yellow", "Blue", "Green", "Black", "Other"]
            },
            {
                name: "Tape Feature",
                key: "tape_feature",
                type: "single",
                important: false,
                options: ["Plain", "Logo/Brand Printed", "Message Printed", "Other"]
            },
            {
                name: "Rolls Per Box",
                key: "rolls_per_box",
                type: "single",
                important: false,
                options: ["72", "48", "36", "60", "24", "144"]
            },
            {
                name: "Backing Material",
                key: "backing_material",
                type: "single",
                important: false,
                options: ["BOPP Film"]
            },
            {
                name: "Brand",
                key: "brand",
                type: "single",
                important: false,
                options: ["Wonder", "Oddy", "Vima", "Elisha", "JK Packwell", "Seal Grip"]
            }
        ]
    },
    {
        name: "Metallic Minerals",
        slug: "metallic-minerals",
        description: "Iron ore, manganese and other metallic minerals",
        specifications: [
            {
                name: "Mineral Type",
                key: "mineral_type",
                type: "single",
                important: true,
                options: ["Iron Ore", "Manganese Ore", "Chromite", "Bauxite", "Copper Ore", "Lead Ore", "Zinc Ore", "Nickel Ore", "Tin Ore", "Wolframite", "Other"]
            },
            {
                name: "Form",
                key: "form",
                type: "single",
                important: true,
                options: ["Lumps", "Fines", "Concentrate", "Pellets", "Powder", "Nuggets", "Other"]
            },
            {
                name: "Grade",
                key: "grade",
                type: "single",
                important: true,
                options: ["High Grade", "Medium Grade", "Low Grade", "Premium", "Standard", "Other"]
            },
            {
                name: "Metal Content",
                key: "metal_content",
                type: "single",
                important: false,
                options: ["30–40 %", "40–50 %", "50–60 %", "60–65 %", ">65 %", "Other"]
            },
            {
                name: "Size",
                key: "size",
                type: "single",
                important: false,
                options: ["0–5 mm", "5–18 mm", "10–40 mm", "10–80 mm", "40–150 mm", "Other"]
            },
            {
                name: "Application",
                key: "application",
                type: "multi",
                important: false,
                options: ["Steel Making", "Alloy Making", "Cement", "Refractory", "Battery", "Chemical", "Foundry", "Other"]
            },
            {
                name: "Origin State",
                key: "origin_state",
                type: "single",
                important: false,
                options: ["Odisha", "Jharkhand", "Chhattisgarh", "Karnataka", "Andhra Pradesh", "Goa"]
            },
            {
                name: "Moisture",
                key: "moisture",
                type: "single",
                important: false,
                options: ["<2 %", "2–4 %", "4–6 %", ">6 %"]
            },
            {
                name: "Packaging Type",
                key: "packaging_type",
                type: "single",
                important: false,
                options: ["Loose", "Rail Rake", "Truck Load", "Jumbo Bag"]
            },
            {
                name: "Lump Size",
                key: "lump_size",
                type: "single",
                important: false,
                options: ["10–30 mm", "10–40 mm", "10–80 mm", "40–150 mm"]
            }
        ]
    },
    {
        name: "Other Textile Fabrics",
        slug: "other-textile-fabrics",
        description: "Other types of textile fabrics",
        specifications: [
            {
                name: "Fabric Type",
                key: "fabric_type",
                type: "single",
                important: true,
                options: ["Poplin", "Organza", "Lycra", "Velvet", "Scuba", "Geotextile", "Canvas", "Net", "Jacquard", "Flannel", "Other"]
            },
            {
                name: "Material",
                key: "material",
                type: "single",
                important: true,
                options: ["Polyester", "Cotton", "Nylon", "Silk", "PP/HDPE", "Rayon", "Wool", "Jute", "Linen", "Spandex", "Other"]
            },
            {
                name: "GSM",
                key: "gsm",
                type: "single",
                important: true,
                options: ["80 GSM", "120 GSM", "150 GSM", "180 GSM", "210 GSM", "250 GSM", "300 GSM", "Other"]
            },
            {
                name: "Weave/Construction",
                key: "construction",
                type: "single",
                important: false,
                options: ["Woven", "Knitted", "Non-Woven", "Other"]
            },
            {
                name: "Design/Pattern",
                key: "pattern",
                type: "single",
                important: false,
                options: ["Plain/Solid", "Printed", "Checks", "Stripes", "Self Design", "Other"]
            },
            {
                name: "Width",
                key: "width",
                type: "single",
                important: false,
                options: ["44 in (112 cm)", "58 in (147 cm)", "36 in (91 cm)", "72 in (183 cm)", "63 in (160 cm)", "Other"]
            },
            {
                name: "Application",
                key: "application",
                type: "multi",
                important: false,
                options: ["Garments", "Home Furnishing", "Industrial Use", "Packaging", "Medical/Hygiene", "Geotextile"]
            },
            {
                name: "Stretch",
                key: "stretch",
                type: "single",
                important: false,
                options: ["4-Way Stretch", "2-Way Stretch", "Non-Stretch"]
            },
            {
                name: "Features",
                key: "features",
                type: "multi",
                important: false,
                options: ["Water Repellent", "Digital Print", "Laminated/Coated", "Embroidered", "Fire Retardant", "Tear Resistant", "UV Stabilized", "Breathable"]
            },
            {
                name: "Color",
                key: "color",
                type: "single",
                important: false,
                options: ["White", "Black", "Blue", "Red", "Green", "Grey", "Yellow", "Cream"]
            }
        ]
    }
];

async function main() {
    console.log('Seeding category templates...');

    for (const template of categoryTemplates) {
        await prisma.categoryTemplate.upsert({
            where: { slug: template.slug },
            update: {
                name: template.name,
                description: template.description,
                specifications: template.specifications
            },
            create: {
                name: template.name,
                slug: template.slug,
                description: template.description,
                specifications: template.specifications
            }
        });
        console.log(`  ✓ ${template.name}`);
    }

    console.log(`\nSeeded ${categoryTemplates.length} category templates successfully!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
