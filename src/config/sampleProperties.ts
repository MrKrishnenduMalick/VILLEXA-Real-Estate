/**
 * BILEKSA PRIVATE RESIDENCES — SAMPLE PROPERTY PORTFOLIO
 * Fictional demonstration residences conceived for portfolio presentation.
 * 
 * NOTE: All addresses, specifications, and prices are fictional portfolio
 * demonstrations designed to showcase ultra-luxury real estate digital experiences.
 */

import { Property } from '../types/property';

export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'res-aurelia-estate-01',
    slug: 'the-aurelia-estate',
    name: 'The Aurelia Estate',
    tagline: 'Monolithic Limestone & Mediterranean Horizon',
    description: 'An architectural private villa compound conceived in raw Roman travertine, floating cantilevered terraces, and a 25-metre infinity reflecting pool overlooking secluded coastal cliffs.',
    architecturalNarrative: 'The Aurelia Estate bridges brutalist architectural serenity with Mediterranean warmth. Designed as a series of cascading pavilions, the residence utilizes thermal limestone envelopes, frameless floor-to-ceiling glass, and internal courtyards to orchestrate natural light and ocean cross-ventilation throughout all seasons.',
    propertyType: 'villa',
    status: 'available',
    location: {
      city: 'North Coast',
      state: 'Goa',
      country: 'India',
      region: 'Coastal Sanctuary',
      suburb: 'Vagator Cliffs',
      coordinates: {
        latitude: 15.6028,
        longitude: 73.7389
      }
    },
    address: 'Pavilion 04, Cliffside Ridge, North Coast Sanctuary, Goa',
    price: 380000000, // ₹38 Crore (~$4.5M USD)
    currency: 'INR',
    priceDisplayPrefix: 'Guide Price',
    showPricePublicly: true,
    isEnquiryOnly: false,
    bedrooms: 6,
    bathrooms: 8,
    powderRooms: 2,
    parkingSpaces: 4,
    carpetArea: { value: 11200, unit: 'sqft' },
    builtUpArea: { value: 14500, unit: 'sqft' },
    plotArea: { value: 1.25, unit: 'acres' },
    ceilingHeightFt: 14.5,
    completionYear: 2025,
    featured: true,
    signatureEstate: true,
    sortOrder: 1,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      {
        id: 'aur-01',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
        category: 'exterior',
        caption: 'Cantilevered limestone facade and infinity reflection pavilion at dusk.',
        altText: 'The Aurelia Estate exterior at dusk',
        isFeatured: true
      },
      {
        id: 'aur-02',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Double-height grand salon featuring bookmatched travertine fireplace.',
        altText: 'Grand salon interior with travertine accents'
      },
      {
        id: 'aur-03',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Minimalist chef kitchen with fluted dark oak cabinetry and marble island.',
        altText: 'Chef kitchen with marble island'
      },
      {
        id: 'aur-04',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
        category: 'terrace',
        caption: 'Open-air dining loggia framing horizon sunset ocean views.',
        altText: 'Outdoor terrace and dining loggia'
      },
      {
        id: 'aur-05',
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
        category: 'exterior',
        caption: 'Landscaped private courtyard with mature olive groves and reflecting water basin.',
        altText: 'Inner courtyard garden'
      }
    ],
    videos: [
      {
        id: 'vid-aur-01',
        title: 'The Aurelia Estate — Architectural Walkthrough',
        videoUrl: '/hero.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
        durationSeconds: 10,
        videoType: 'walkthrough'
      }
    ],
    floorPlans: [
      {
        id: 'fp-aur-01',
        level: 'Ground Level',
        title: 'Grand Living & Pool Pavilion',
        planImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85',
        area: { value: 7500, unit: 'sqft' },
        description: 'Includes formal receiving salon, chef and prep kitchens, guest suite, and direct access to the 25m pool terrace.'
      },
      {
        id: 'fp-aur-02',
        level: 'First Level',
        title: 'Private Suites & Observatory',
        planImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85',
        area: { value: 7000, unit: 'sqft' },
        description: 'Primary owner wing with dual dressing lounges, 4 ensuite bedrooms, and private sunrise viewing loggia.'
      }
    ],
    amenities: [
      '25m Heated Negative-Edge Pool',
      'Private Wellness Spa & Sauna',
      'Subterranean 1,200-Bottle Wine Vault',
      'Dedicated Staff Quarters (4 Persons)',
      'Automated Bioclimatic Pergolas',
      'Off-Grid Solar & Battery Storage System'
    ],
    specifications: [
      {
        category: 'Structure & Facade',
        items: [
          { label: 'Exterior Material', value: 'Vein-cut Tivoli Roman Travertine' },
          { label: 'Glazing System', value: 'Sky-Frame 3-Track Frameless Minimal Glass' },
          { label: 'Thermal Envelope', value: 'Double-wall cavity with natural cork insulation' }
        ]
      },
      {
        category: 'Interior Finishes',
        items: [
          { label: 'Flooring', value: 'Large-format honed Jura Beige Limestone' },
          { label: 'Cabinetry', value: 'Custom fumed European Oak by Atelier Joinery' },
          { label: 'Fixtures', value: 'Brushed raw bronze by Vola and Gessi' }
        ]
      }
    ],
    locationHighlights: [
      'Direct private coastal trail access',
      '15 minutes to private helipad',
      'Surrounded by permanent nature reserve buffers',
      'Unobstructed 270-degree sunset ocean views'
    ],
    brochure: {
      title: 'The Aurelia Estate — Private Monograph',
      fileUrl: '/brochures/the-aurelia-estate.pdf',
      fileSizeFormatted: '18.4 MB'
    },
    enquiryConfig: {
      privateViewingAvailable: true,
      whatsappMessage: 'I would like to schedule a confidential consultation regarding The Aurelia Estate.'
    },
    createdAt: '2026-10-15T00:00:00.000Z',
    updatedAt: '2026-10-31T00:00:00.000Z'
  },
  {
    id: 'res-celestia-penthouse-02',
    slug: 'the-celestia-penthouse',
    name: 'The Celestia Penthouse',
    tagline: 'Sky Sanctuary with Double-Height Horizon Vistas',
    description: 'An elevated triplex penthouse commanding 360-degree panoramic skyline and Arabian Sea vistas, featuring 7-metre soaring ceilings, an internal glass elevator, and a private sky pool.',
    architecturalNarrative: 'Suspended above the metropolis, The Celestia Penthouse was engineered to evoke infinite verticality and spatial serenity. The residence features continuous perimeter glazing, acoustic ceiling engineering, and an open sculptural bronze staircase anchoring the three vertical living tiers.',
    propertyType: 'penthouse',
    status: 'available',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      region: 'South Mumbai',
      suburb: 'Worli Sea Face',
      coordinates: {
        latitude: 19.0176,
        longitude: 72.8156
      }
    },
    address: 'Tiers 58–60, The Sovereign Tower, Worli Sea Face, Mumbai',
    price: 550000000, // ₹55 Crore (~$6.6M USD)
    currency: 'INR',
    priceDisplayPrefix: 'Guide Price',
    showPricePublicly: true,
    isEnquiryOnly: false,
    bedrooms: 5,
    bathrooms: 6,
    powderRooms: 2,
    parkingSpaces: 4,
    carpetArea: { value: 7800, unit: 'sqft' },
    builtUpArea: { value: 9200, unit: 'sqft' },
    ceilingHeightFt: 22.0,
    completionYear: 2026,
    featured: true,
    signatureEstate: true,
    sortOrder: 2,
    coverImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      {
        id: 'cel-01',
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Double-height cathedral living room with floor-to-ceiling sea face vistas.',
        altText: 'The Celestia Penthouse cathedral salon',
        isFeatured: true
      },
      {
        id: 'cel-02',
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Sculptural bronze spiral staircase connecting the triplex levels.',
        altText: 'Sculptural staircase'
      },
      {
        id: 'cel-03',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
        category: 'terrace',
        caption: 'Private rooftop sky deck with heated counter-current lap pool.',
        altText: 'Rooftop sky pool'
      },
      {
        id: 'cel-04',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Primary suite overlooking the coastal horizon with private dressing room.',
        altText: 'Primary suite with panoramic views'
      }
    ],
    floorPlans: [
      {
        id: 'fp-cel-01',
        level: 'Lower Level 58',
        title: 'Grand Entertaining Salon',
        planImageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85',
        area: { value: 3800, unit: 'sqft' },
        description: 'Receiving salon, formal 16-seat dining room, show kitchen, and service annex.'
      },
      {
        id: 'fp-cel-02',
        level: 'Upper Levels 59–60',
        title: 'Private Suites & Sky Deck',
        planImageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85',
        area: { value: 5400, unit: 'sqft' },
        description: '5 master suites, private wellness chamber, and private rooftop swimming terrace.'
      }
    ],
    amenities: [
      'Private High-Speed Direct In-Residence Elevator',
      'Rooftop Infinity Sky Pool',
      'Private 8-Seat Screening Room',
      'Crestron Integrated Smart Home Intelligence',
      'Dedicated 24/7 White-Glove Valet & Concierge',
      'Biometric Security Access Control'
    ],
    specifications: [
      {
        category: 'Finishes & Joinery',
        items: [
          { label: 'Flooring', value: 'Bookmatched Statuario Marble slabs' },
          { label: 'Glazing', value: 'Acoustic laminated triple-glazed Low-E panes' },
          { label: 'Ceilings', value: 'Seamless micro-perforated acoustic plaster' }
        ]
      }
    ],
    locationHighlights: [
      'Direct coastal sea face panorama',
      '10 minutes to Bandra-Worli Sea Link',
      'Helipad atop tower with VIP clearance',
      'Private marina docking privileges'
    ],
    brochure: {
      title: 'The Celestia Penthouse — Architectural Prospectus',
      fileUrl: '/brochures/the-celestia-penthouse.pdf',
      fileSizeFormatted: '22.1 MB'
    },
    enquiryConfig: {
      privateViewingAvailable: true,
      whatsappMessage: 'I would like to inquire about a private architectural viewing of The Celestia Penthouse.'
    },
    createdAt: '2026-10-18T00:00:00.000Z',
    updatedAt: '2026-10-31T00:00:00.000Z'
  },
  {
    id: 'res-ocean-crest-03',
    slug: 'the-ocean-crest',
    name: 'The Ocean Crest',
    tagline: 'Coastal Travertine Pavilion & Direct Beach Access',
    description: 'A serene single-level seaside villa featuring extensive horizontal rooflines, weathered teak screens, and a natural tidal swimming pool opening directly onto pristine white sands.',
    architecturalNarrative: 'Conceived to dissolve boundaries between internal tranquility and the rhythm of the ocean, The Ocean Crest employs deep sheltered overhangs, local laterite foundations, and continuous terrazzo floors that flow from inner courtyards directly onto beachfront sand dunes.',
    propertyType: 'waterfront',
    status: 'available',
    location: {
      city: 'Mandrem Beach',
      state: 'Goa',
      country: 'India',
      region: 'North Coast',
      suburb: 'Dune Sanctuary',
      coordinates: {
        latitude: 15.6706,
        longitude: 73.7142
      }
    },
    address: 'Plot 12, Coconut Grove Esplanade, Mandrem Sanctuary, Goa',
    price: 420000000, // ₹42 Crore (~$5.0M USD)
    currency: 'INR',
    priceDisplayPrefix: 'Price Upon Request',
    showPricePublicly: false, // Enquiry Only demonstrated
    isEnquiryOnly: true,
    bedrooms: 5,
    bathrooms: 6,
    powderRooms: 1,
    parkingSpaces: 3,
    carpetArea: { value: 9200, unit: 'sqft' },
    builtUpArea: { value: 11800, unit: 'sqft' },
    plotArea: { value: 0.85, unit: 'acres' },
    ceilingHeightFt: 12.5,
    completionYear: 2025,
    featured: true,
    signatureEstate: false,
    sortOrder: 3,
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      {
        id: 'ocn-01',
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
        category: 'exterior',
        caption: 'Low-slung pavilion silhouette set amidst lush native coastal palms.',
        altText: 'The Ocean Crest beach pavilion',
        isFeatured: true
      },
      {
        id: 'ocn-02',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
        category: 'terrace',
        caption: 'Sandstone poolside terrace stepping down directly to the beach reserve.',
        altText: 'Beachfront swimming pool'
      },
      {
        id: 'ocn-03',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Open living salon opening with 18-metre motorized pocket sliding doors.',
        altText: 'Open plan beachfront living salon'
      }
    ],
    floorPlans: [
      {
        id: 'fp-ocn-01',
        level: 'Single Level Masterplan',
        title: 'Coastal Pavilion Enclave',
        planImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=85',
        area: { value: 11800, unit: 'sqft' },
        description: 'Integrated single-floor layout connecting 5 detached bedroom pavilions via covered breezeways.'
      }
    ],
    amenities: [
      'Direct Private Beachfront Access Gates',
      'Natural Saltwater Infinity Basin',
      'Outdoor Rainforest Showers & Plunge Pools',
      'Private Surfboard & Watercraft Storage',
      'Automated Teak Storm Shutters',
      'Full Greywater Recycling & Permaculture Garden'
    ],
    specifications: [
      {
        category: 'Materials',
        items: [
          { label: 'External Walls', value: 'Chiseled Marine-grade Limestone' },
          { label: 'Screening', value: 'Sustainably sourced reclaimed Burma Teak' },
          { label: 'Roofing', value: 'Standing seam zinc with integrated rainwater capture' }
        ]
      }
    ],
    locationHighlights: [
      'Direct private access to 2.5 km of quiet sandy shoreline',
      'Uninterrupted coastal sunset horizon',
      '30 minutes to MOPA International Airport',
      'Quiet heritage residential enclave'
    ],
    enquiryConfig: {
      privateViewingAvailable: true,
      whatsappMessage: 'I am requesting confidential acquisition details for The Ocean Crest seaside residence.'
    },
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-31T00:00:00.000Z'
  },
  {
    id: 'res-highland-manor-04',
    slug: 'the-highland-manor',
    name: 'The Highland Manor',
    tagline: 'Terraced Basalt & Alpine Pine Forest Panorama',
    description: 'An alpine architectural sanctuary anchored into stepped granite cliffs, featuring blackened timber cladding, triple-glazed viewing lounges, and geothermal radiant floor heating.',
    architecturalNarrative: 'Designed as a dialogue with mountain topography, The Highland Manor steps down a 45-degree granite hillside. Heavy hand-chiseled stone foundations ground the home, while lightweight steel-and-glass pavilions extend outward to capture Himalayan vistas.',
    propertyType: 'villa',
    status: 'available',
    location: {
      city: 'Kasauli Hills',
      state: 'Himachal Pradesh',
      country: 'India',
      region: 'Alpine Sanctuary',
      suburb: 'Pine Crest Ridge',
      coordinates: {
        latitude: 30.9013,
        longitude: 76.9649
      }
    },
    address: 'Estate 07, Pine Crest Ridge, Upper Kasauli, Himachal Pradesh',
    price: 280000000, // ₹28 Crore (~$3.3M USD)
    currency: 'INR',
    priceDisplayPrefix: 'Guide Price',
    showPricePublicly: true,
    isEnquiryOnly: false,
    bedrooms: 4,
    bathrooms: 5,
    powderRooms: 1,
    parkingSpaces: 3,
    carpetArea: { value: 6800, unit: 'sqft' },
    builtUpArea: { value: 8400, unit: 'sqft' },
    plotArea: { value: 1.5, unit: 'acres' },
    ceilingHeightFt: 15.0,
    completionYear: 2024,
    featured: false,
    signatureEstate: false,
    sortOrder: 4,
    coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      {
        id: 'hld-01',
        url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=85',
        category: 'exterior',
        caption: 'Stepped mountain retreat with dark charred timber and local slate stone.',
        altText: 'The Highland Manor mountain exterior',
        isFeatured: true
      },
      {
        id: 'hld-02',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Heated library and fireside lounge with floor-to-ceiling valley panoramas.',
        altText: 'Fireside mountain lounge'
      },
      {
        id: 'hld-03',
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
        category: 'terrace',
        caption: 'Cantilevered heated viewing deck hovering above alpine pine forests.',
        altText: 'Alpine viewing deck'
      }
    ],
    floorPlans: [
      {
        id: 'fp-hld-01',
        level: 'Terraced Masterplan',
        title: 'Three-Tier Alpine Layout',
        planImageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=85',
        area: { value: 8400, unit: 'sqft' },
        description: 'Upper entry observatory, central social hearth, and lower private bedroom suites.'
      }
    ],
    amenities: [
      'Geothermal In-Floor Hydronic Heating',
      'Glass-Enclosed Heated Alpine Hydro-Spa',
      'Dual Hearth Wood-Burning Fireplaces',
      'Stargazing Observatory with Retractable Skylight',
      'Backup Power Micro-Grid with Battery Storage',
      'Enclosed Heated 3-Car Parking'
    ],
    specifications: [
      {
        category: 'Engineering & Envelopes',
        items: [
          { label: 'Cladding', value: 'Yakisugi Charred Japanese Larch' },
          { label: 'Masonry', value: 'Hand-split local Himalayan slate' },
          { label: 'Heating', value: 'Ground-source closed loop geothermal' }
        ]
      }
    ],
    locationHighlights: [
      '6,200 ft elevation with clean mountain air quality',
      'Protected views over pristine reserve pine forests',
      '1.5 hours drive from Chandigarh Airport',
      'Private gated mountain community access'
    ],
    enquiryConfig: {
      privateViewingAvailable: true,
      whatsappMessage: 'Please provide private viewing dates for The Highland Manor.'
    },
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-31T00:00:00.000Z'
  },
  {
    id: 'res-solstice-residences-05',
    slug: 'the-solstice-residences',
    name: 'The Solstice Residences',
    tagline: 'Minimalist Architectural Apartments with Wrap-Around Terraces',
    description: 'A boutique collection of single-floor residences featuring sweeping architectural concrete loggias, private plunge pools, and seamless indoor-outdoor living spaces.',
    architecturalNarrative: 'The Solstice Residences redefine vertical living through expansive floor plates and perimeter greenery. Each residence occupies an entire private floor plate, offering private elevator vestibules, 3.8-metre ceiling clearances, and custom bronze-finished brise-soleil screening.',
    propertyType: 'apartment',
    status: 'available',
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      region: 'Jubilee Enclave',
      suburb: 'Jubilee Hills Road 36',
      coordinates: {
        latitude: 17.4319,
        longitude: 78.4073
      }
    },
    address: 'Floor 08, The Solstice Tower, Road 36, Jubilee Hills, Hyderabad',
    price: 185000000, // ₹18.5 Crore (~$2.2M USD)
    currency: 'INR',
    priceDisplayPrefix: 'Starting from',
    showPricePublicly: true,
    isEnquiryOnly: false,
    bedrooms: 4,
    bathrooms: 5,
    powderRooms: 1,
    parkingSpaces: 3,
    carpetArea: { value: 5200, unit: 'sqft' },
    builtUpArea: { value: 6100, unit: 'sqft' },
    ceilingHeightFt: 12.8,
    completionYear: 2026,
    featured: false,
    signatureEstate: false,
    sortOrder: 5,
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      {
        id: 'sol-01',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
        category: 'exterior',
        caption: 'Architectural fluted concrete facade with stepped terrace gardens.',
        altText: 'The Solstice Residences facade',
        isFeatured: true
      },
      {
        id: 'sol-02',
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Expansive formal salon with seamless connection to private sky loggia.',
        altText: 'Contemporary apartment salon'
      },
      {
        id: 'sol-03',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Minimalist designer kitchen with integrated Gaggenau appliances.',
        altText: 'Modern kitchen interior'
      }
    ],
    floorPlans: [
      {
        id: 'fp-sol-01',
        level: 'Single Floor Residence',
        title: 'Full-Floor Master Layout',
        planImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=85',
        area: { value: 6100, unit: 'sqft' },
        description: 'Private elevator foyer, 4 bedroom suites, staff chamber, and 120 ft continuous loggia.'
      }
    ],
    amenities: [
      'Single Residence per Floor Privacy',
      'Private Heated Terrace Plunge Pool',
      'Direct Private Keycard Elevator Access',
      'Integrated Italian Poliform Wardrobe Systems',
      'Residents Wellness Center & Pilates Studio',
      'Automated Electric Vehicle Charging Stations'
    ],
    specifications: [
      {
        category: 'Architectural Details',
        items: [
          { label: 'Facade', value: 'High-performance glass fiber reinforced concrete (GFRC)' },
          { label: 'Appliances', value: 'Fully integrated Gaggenau 400 Series' },
          { label: 'Flooring', value: 'Engineered Chevron European White Oak' }
        ]
      }
    ],
    locationHighlights: [
      'Prime Jubilee Hills ridge position',
      'Direct access to premier dining & art galleries',
      'Panoramic vistas across KBR National Park greenery',
      'Private 24-hour security perimeter'
    ],
    enquiryConfig: {
      privateViewingAvailable: true,
      whatsappMessage: 'I am interested in scheduling a preview of The Solstice Residences.'
    },
    createdAt: '2026-10-24T00:00:00.000Z',
    updatedAt: '2026-10-31T00:00:00.000Z'
  },
  {
    id: 'res-elysian-gardens-06',
    slug: 'the-elysian-gardens',
    name: 'The Elysian Gardens',
    tagline: 'Biophilic Masterplanned Enclave of Private Forest Estates',
    description: 'An exclusive gated development of eight private architectural villas embedded within 25 acres of protected botanical forest, featuring private organic orchards and club pavilions.',
    architecturalNarrative: 'The Elysian Gardens reinterprets the grand heritage country estate for the 21st century. Rooted in biophilic design principles, each bespoke villa is aligned with microclimate solar paths and framed by 100-year-old banyan canopies, creating profound spatial privacy.',
    propertyType: 'residential_development',
    status: 'available',
    location: {
      city: 'North Bengaluru',
      state: 'Karnataka',
      country: 'India',
      region: 'Airport Boulevard',
      suburb: 'Devanahalli Foothills',
      coordinates: {
        latitude: 13.2483,
        longitude: 77.7126
      }
    },
    address: 'Estate 03, The Elysian Botanical Reserve, Devanahalli, Bengaluru',
    price: 620000000, // ₹62 Crore (~$7.4M USD)
    currency: 'INR',
    priceDisplayPrefix: 'Estate Release',
    showPricePublicly: true,
    isEnquiryOnly: false,
    bedrooms: 6,
    bathrooms: 8,
    powderRooms: 2,
    parkingSpaces: 5,
    carpetArea: { value: 13500, unit: 'sqft' },
    builtUpArea: { value: 16200, unit: 'sqft' },
    plotArea: { value: 2.1, unit: 'acres' },
    ceilingHeightFt: 16.0,
    completionYear: 2026,
    featured: true,
    signatureEstate: true,
    sortOrder: 6,
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      {
        id: 'ely-01',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
        category: 'exterior',
        caption: 'Monumental modern villa pavilion surrounded by mature botanical gardens.',
        altText: 'The Elysian Gardens villa exterior',
        isFeatured: true
      },
      {
        id: 'ely-02',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
        category: 'interior',
        caption: 'Grand gallery living hall with glass atrium and internal bamboo garden.',
        altText: 'Gallery living hall'
      },
      {
        id: 'ely-03',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
        category: 'terrace',
        caption: '30-metre lap pool with pavilion poolhouse and landscaped lawn.',
        altText: 'Lap pool and pavilion'
      }
    ],
    floorPlans: [
      {
        id: 'fp-ely-01',
        level: 'Ground Level',
        title: 'Garden Level Pavilions',
        planImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=85',
        area: { value: 9200, unit: 'sqft' },
        description: 'Grand receiving spaces, banquet dining, kitchen pavilion, and 2 guest pavilions.'
      },
      {
        id: 'fp-ely-02',
        level: 'First Level',
        title: 'Family & Owner Sanctuary',
        planImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85',
        area: { value: 7000, unit: 'sqft' },
        description: 'Primary owner compound with dual marble baths, study, and private forest-facing balconies.'
      }
    ],
    amenities: [
      '30-Metre Private Swimming Basin',
      'Private Organic Fruit Orchard & Herb Nursery',
      'Subterranean 6-Car Collector Gallery',
      'Private Squash Court & Gymnasium',
      'Independent 2-Bedroom Guard & Staff Lodge',
      '25-Acre Gated Forest Reserve Security'
    ],
    specifications: [
      {
        category: 'Biophilic Architecture',
        items: [
          { label: 'Energy Performance', value: 'Net-zero ready with 40kW solar canopy' },
          { label: 'Water Security', value: '100% rainwater harvesting with natural bio-swales' },
          { label: 'Acoustics', value: 'STC 62 acoustic separation throughout all bedrooms' }
        ]
      }
    ],
    locationHighlights: [
      '15 minutes to Kempegowda International Airport (BLR)',
      'Direct highway corridor to Hebbal & North Tech Parks',
      'Adjacent to protected green belt and agricultural hills',
      'Bespoke estate security with perimeter radar detection'
    ],
    brochure: {
      title: 'The Elysian Gardens — Masterplan & Estates Monograph',
      fileUrl: '/brochures/the-elysian-gardens.pdf',
      fileSizeFormatted: '26.8 MB'
    },
    enquiryConfig: {
      privateViewingAvailable: true,
      whatsappMessage: 'I am requesting a private briefing for The Elysian Gardens estate development.'
    },
    createdAt: '2026-10-25T00:00:00.000Z',
    updatedAt: '2026-10-31T00:00:00.000Z'
  }
];

export const SAMPLE_PROPERTIES_BY_SLUG: Record<string, Property> = SAMPLE_PROPERTIES.reduce(
  (acc, prop) => {
    acc[prop.slug] = prop;
    return acc;
  },
  {} as Record<string, Property>
);

