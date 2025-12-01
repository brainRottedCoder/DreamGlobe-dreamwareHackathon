// Dream Globe - Destination Data
// Contains all country and destination information for the journey

export interface StreetViewCoords {
  lat: number;
  lng: number;
  heading?: number; // Camera direction in degrees (0-360)
  pitch?: number;   // Camera pitch in degrees (-90 to 90)
  zoom?: number;    // Zoom level (0-4)
  fallbackCoords?: Array<{ lat: number; lng: number }>; // Backup locations within 1km if primary fails
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  description: string;
  streetViewCoords: StreetViewCoords;
  narration: string; // Voiceover script for this destination
  narrationAudio?: string; // Path to narration audio file
  photoBackground: string; // Path to high-quality background image for composite
  ambientSound?: string; // Path to ambient sound file
}

export interface Airport {
  name: string;
  code: string; // IATA code
  city: string;
  streetViewCoords: StreetViewCoords;
  narration: string;
  narrationAudio?: string; // Path to narration audio file
  useStaticImage?: boolean; // Use static image with parallax instead of Street View
  staticImageUrl?: string; // Path to static image
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  emoji: string;
  airport: Airport;
  destinations: Destination[];
  musicTheme: string; // Path to background music file
  travelVideos: string[]; // Paths to travel transition videos
}

// =============================================================================
// INDIA
// =============================================================================
const india: Country = {
  id: 'india',
  name: 'India',
  flag: '🇮🇳',
  emoji: '🇮🇳',
  airport: {
    name: 'Indira Gandhi International Airport',
    code: 'DEL',
    city: 'New Delhi',
    streetViewCoords: {
      lat: 28.5562, // Terminal 3 International Arrivals
      lng: 77.1000,
      heading: 180,
      pitch: 0,
      zoom: 1,
      fallbackCoords: [
        { lat: 28.5565, lng: 77.0999 }, // Terminal 3 entrance
        { lat: 28.5560, lng: 77.1005 }, // Arrival area exterior
        { lat: 28.5567, lng: 77.0995 }  // Terminal 3 departure drop-off
      ]
    },
    narration: "Welcome to India! You've just landed at Indira Gandhi International Airport in New Delhi, the vibrant capital of India. Get ready to explore the incredible diversity, rich history, and timeless beauty of this magnificent country.",
    narrationAudio: '/destinationvoices/india/indiaairport.mp3',
    useStaticImage: false
  },
  destinations: [
    {
      id: 'taj-mahal',
      name: 'Taj Mahal',
      city: 'Agra',
      description: 'The iconic white marble mausoleum, one of the Seven Wonders of the World',
      streetViewCoords: {
        lat: 27.1735873,
        lng: 78.0419947,
        heading: 357.68,
        pitch: -9.58,
        zoom: 1,
        fallbackCoords: [
          { lat: 27.1750, lng: 78.0421 }, // East entrance
          { lat: 27.1730, lng: 78.0400 }  // Garden path
        ]
      },
      narration: "Behold the Taj Mahal, a UNESCO World Heritage Site and eternal symbol of love. Built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, this white marble masterpiece took 22 years and 20,000 artisans to complete. Its beauty changes with the light of day, from soft pink at dawn to glowing gold at sunset.",
      narrationAudio: '/destinationvoices/india/tajmahal.mp3',
      photoBackground: '/images/destinations/india/taj-mahal.jpg',
      ambientSound: '/audio/ambient/india/taj-mahal-birds.mp3'
    },
    {
      id: 'red-fort',
      name: 'Red Fort',
      city: 'Delhi',
      description: 'Historic 17th-century Mughal fortress and UNESCO World Heritage Site',
      streetViewCoords: {
        lat: 28.6559926,
        lng: 77.2378792,
        heading: 88.24,
        pitch: -0.87,
        zoom: 1,
        fallbackCoords: [
          { lat: 28.6562, lng: 77.2410 }, // Lahori Gate entrance
          { lat: 28.6548, lng: 77.2370 }  // Netaji Subhash Marg view
        ]
      },
      narration: "Welcome to the Red Fort, or Lal Qila, a magnificent fortress built by Emperor Shah Jahan in 1648. This UNESCO World Heritage Site served as the main residence of Mughal emperors for nearly 200 years. Its massive red sandstone walls and intricate architecture represent the pinnacle of Mughal creativity.",
      narrationAudio: '/destinationvoices/india/redfort.mp3',
      photoBackground: '/images/destinations/india/red-fort.jpg',
      ambientSound: '/audio/ambient/india/fort-winds.mp3'
    },
    {
      id: 'qutub-minar',
      name: 'Qutub Minar',
      city: 'Delhi',
      description: 'The tallest brick minaret in the world, a masterpiece of Indo-Islamic architecture',
      streetViewCoords: {
        lat: 28.5243794,
        lng: 77.1846329,
        heading: 66.17,
        pitch: -2.79,
        zoom: 1,
        fallbackCoords: [
          { lat: 28.5244, lng: 77.1854 }, // Main entrance area
          { lat: 28.5240, lng: 77.1840 }  // Garden pathway
        ]
      },
      narration: "Behold the Qutub Minar, a 73-meter tall victory tower and UNESCO World Heritage Site. Built in 1193, this red sandstone minaret is adorned with intricate carvings and verses from the Quran. It stands as a testament to the architectural brilliance of medieval India and the beginning of Muslim rule in the region.",
      narrationAudio: '/destinationvoices/india/qutubminar.mp3',
      photoBackground: '/images/destinations/india/qutub-minar.jpg',
      ambientSound: '/audio/ambient/india/birds-wind.mp3'
    }
  ],
  musicTheme: '/audio/music/india-sitar.mp3',
  travelVideos: [
    '/taxivideos/Indian_City_Taxi_POV_Video_opt_opt.mp4',
    '/taxivideos/india-auto-rickshaw-pov.mp4', // Auto-rickshaw through busy streets
    '/taxivideos/india-metro-pov.mp4', // Delhi Metro modern transit
    '/taxivideos/india-bus-pov.mp4', // Local bus through city
    '/taxivideos/india-street-walk-pov.mp4' // Walking through market streets
  ]
};

// =============================================================================
// UNITED STATES
// =============================================================================
const usa: Country = {
  id: 'usa',
  name: 'United States',
  flag: '🇺🇸',
  emoji: '🇺🇸',
  airport: {
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    city: 'New York',
    streetViewCoords: {
      lat: 40.6413,
      lng: -73.7781,
      heading: 120,
      pitch: 0,
      zoom: 1
    },
    narration: "Welcome to the United States! You've arrived at JFK International Airport in New York City, the city that never sleeps. From towering skyscrapers to natural wonders, America's diversity and spirit of freedom await you.",
    narrationAudio: '/destinationvoices/usa/usaairport.mp3'
  },
  destinations: [
    {
      id: 'statue-of-liberty',
      name: 'Statue of Liberty & Ellis Island',
      city: 'New York City',
      description: 'Icon of freedom and democracy, welcoming millions to America',
      streetViewCoords: {
        lat: 40.6893442,
        lng: -74.0435614,
        heading: 264,
        pitch: -12,
        zoom: 1,
        fallbackCoords: [
          { lat: 40.6892, lng: -74.0445 }, // Battery Park view
          { lat: 40.6895, lng: -74.0440 }  // Liberty Island dock
        ]
      },
      narration: "Standing before you is Lady Liberty, a gift from France and one of the most recognizable symbols of freedom in the world. Since 1886, this 305-foot copper statue has welcomed immigrants and visitors to New York Harbor. Behind her lies Ellis Island, where over 12 million immigrants entered the United States, making it the gateway to the American Dream.",
      narrationAudio: '/destinationvoices/usa/statueofliberty.mp3',
      photoBackground: '/images/destinations/usa/statue-of-liberty.jpg',
      ambientSound: '/audio/ambient/usa/ocean-seagulls.mp3'
    },
    {
      id: 'times-square',
      name: 'Times Square',
      city: 'New York City',
      description: 'The bright heart of Manhattan, where Broadway meets the world',
      streetViewCoords: {
        lat: 40.7578873,
        lng: -73.9856611,
        heading: 30,
        pitch: -32,
        zoom: 1,
        fallbackCoords: [
          { lat: 40.7589, lng: -73.9851 }, // 7th Avenue & 46th Street
          { lat: 40.7577, lng: -73.9857 }, // TKTS area
          { lat: 40.7585, lng: -73.9862 }, // Broadway & 45th
          { lat: 40.7590, lng: -73.9845 }  // Times Square north
        ]
      },
      narration: "Welcome to Times Square, the dazzling crossroads of the world! This iconic intersection in the heart of Manhattan is famous for its massive digital billboards, Broadway theaters, and electric atmosphere. Over 330,000 people pass through Times Square every day, making it one of the world's most visited tourist attractions. The bright lights, towering screens, and constant energy make this the place that never sleeps.",
      narrationAudio: '/destinationvoices/usa/timesquare.mp3',
      photoBackground: '/images/destinations/usa/times-square.jpg',
      ambientSound: '/audio/ambient/usa/city-buzz.mp3'
    },
    {
      id: 'met-museum',
      name: 'Metropolitan Museum of Art',
      city: 'New York City',
      description: 'One of the world\'s largest and finest art museums',
      streetViewCoords: {
        lat: 40.7795347,
        lng: -73.9636902,
        heading: 290,
        pitch: 5.76,
        zoom: 1,
        fallbackCoords: [
          { lat: 40.7789, lng: -73.9637 }, // Fifth Avenue entrance steps
          { lat: 40.7798, lng: -73.9625 }, // Side entrance view
          { lat: 40.7794, lng: -73.9632 }  // Original fallback
        ]
      },
      narration: "You're standing before The Metropolitan Museum of Art, one of the world's greatest cultural treasures. Founded in 1870, The Met houses over 2 million works of art spanning 5,000 years of human creativity. From ancient Egyptian temples to modern masterpieces, from European paintings to American sculpture, this iconic museum on Fifth Avenue offers an unparalleled journey through art history.",
      narrationAudio: '/destinationvoices/usa/metmuseum.mp3',
      photoBackground: '/images/destinations/usa/met-museum.jpg',
      ambientSound: '/audio/ambient/usa/museum-atmosphere.mp3'
    },
    {
      id: 'biltmore',
      name: 'Biltmore Estate',
      city: 'Asheville, North Carolina',
      description: 'America\'s largest privately owned home, a Gilded Age masterpiece',
      streetViewCoords: {
        lat: 35.5403798,
        lng: -82.5527826,
        heading: 288,
        pitch: -5,
        zoom: 1,
        fallbackCoords: [
          { lat: 35.5395, lng: -82.5530 }, // Front lawn approach
          { lat: 35.5410, lng: -82.5520 }  // Winery entrance
        ]
      },
      narration: "Welcome to Biltmore Estate, America's largest privately owned home and a stunning example of Gilded Age grandeur. Built by George Vanderbilt in 1895, this 178,926-square-foot château features 250 rooms, including 35 bedrooms and 43 bathrooms. Set on 8,000 acres in the Blue Ridge Mountains, Biltmore combines French Renaissance architecture with breathtaking mountain views, meticulously landscaped gardens designed by Frederick Law Olmsted, and a winery producing award-winning wines.",
      narrationAudio: '/destinationvoices/usa/biltmore.mp3',
      photoBackground: '/images/destinations/usa/biltmore.jpg',
      ambientSound: '/audio/ambient/usa/estate-gardens.mp3'
    }
  ],
  musicTheme: '/audio/music/usa-jazz.mp3',
  travelVideos: [
    '/taxivideos/Taxi_POV_City_Drive_opt_opt.mp4',
    '/taxivideos/usa-subway-pov.mp4', // NYC Subway ride
    '/taxivideos/usa-uber-brooklyn-bridge-pov.mp4', // Uber crossing Brooklyn Bridge
    '/taxivideos/usa-walking-fifth-avenue-pov.mp4' // Walking Fifth Avenue
  ]
};

// =============================================================================
// FRANCE
// =============================================================================
const france: Country = {
  id: 'france',
  name: 'France',
  flag: '🇫🇷',
  emoji: '🇫🇷',
  airport: {
    name: 'Charles de Gaulle Airport',
    code: 'CDG',
    city: 'Paris',
    streetViewCoords: {
      lat: 49.0106213,
      lng: 2.5596553,
      heading: 302.51,
      pitch: -5.77,
      zoom: 1
    },
    narration: "Bienvenue en France! Welcome to Charles de Gaulle Airport in Paris, the City of Light. Prepare to immerse yourself in art, culture, cuisine, and the timeless elegance that makes France the world's most visited country.",
    narrationAudio: '/destinationvoices/france/frenchairport.mp3'
  },
  destinations: [
    {
      id: 'eiffel-tower',
      name: 'Eiffel Tower',
      city: 'Paris',
      description: 'The iron lattice tower that has become the symbol of Paris',
      streetViewCoords: {
        lat: 48.8610561,
        lng: 2.2909009,
        heading: 143.84,
        pitch: -5.64,
        zoom: 1,
        fallbackCoords: [
          { lat: 48.8584, lng: 2.2945 }, // Trocadéro viewpoint
          { lat: 48.8620, lng: 2.2900 }  // Champ de Mars
        ]
      },
      narration: "Voilà! The Eiffel Tower, Paris's most iconic landmark. Built by Gustave Eiffel for the 1889 World's Fair, this iron lattice tower stands 1,083 feet tall. Though initially criticized by Parisians, it has become the symbol of French innovation and romance, visited by nearly 7 million people each year.",
      narrationAudio: '/destinationvoices/france/eiffeltower.mp3',
      photoBackground: '/images/destinations/france/eiffel-tower.jpg',
      ambientSound: '/audio/ambient/france/paris-street.mp3'
    },
    {
      id: 'fontainebleau',
      name: 'Château de Fontainebleau',
      city: 'Fontainebleau',
      description: 'A magnificent royal château with 800 years of French history',
      streetViewCoords: {
        lat: 48.4020706,
        lng: 2.6987077,
        heading: 83.45,
        pitch: -5.5,
        zoom: 1,
        fallbackCoords: [
          { lat: 48.4025, lng: 2.6995 }, // Main courtyard
          { lat: 48.4015, lng: 2.6980 }  // Gardens entrance
        ]
      },
      narration: "Welcome to Château de Fontainebleau, one of France's largest royal palaces with over 800 years of history. This UNESCO World Heritage site served as a residence for French monarchs from Louis VII to Napoleon III. The château showcases stunning Renaissance and classical architecture, featuring 1,500 rooms, exquisite frescoes, and beautiful gardens.",
      narrationAudio: '/destinationvoices/france/fountainebleau.mp3',
      photoBackground: '/images/destinations/france/fontainebleau.jpg',
      ambientSound: '/audio/ambient/france/palace-quiet.mp3'
    },
    {
      id: 'chambord',
      name: 'Château de Chambord',
      city: 'Loire Valley',
      description: 'The largest château in the Loire Valley, a Renaissance masterpiece',
      streetViewCoords: {
        lat: 47.6156872,
        lng: 1.5177308,
        heading: 321.36,
        pitch: -18.11,
        zoom: 1,
        fallbackCoords: [
          { lat: 47.6162, lng: 1.5185 }, // Front approach road
          { lat: 47.6150, lng: 1.5170 }  // Canal view
        ]
      },
      narration: "Behold Château de Chambord, the largest and most magnificent château in the Loire Valley. Built by King Francis I as a hunting lodge, this Renaissance masterpiece features 440 rooms, 282 fireplaces, and 84 staircases. Its iconic double-helix staircase, possibly designed by Leonardo da Vinci, is an architectural wonder. The château sits in a vast 13,000-acre forest park.",
      narrationAudio: '/destinationvoices/france/chambord.mp3',
      photoBackground: '/images/destinations/france/chambord.jpg',
      ambientSound: '/audio/ambient/france/countryside.mp3'
    },
  ],
  musicTheme: '/audio/music/france-accordion.mp3',
  travelVideos: [
    '/taxivideos/Parisian_Taxi_Ride_POV_opt_opt.mp4',
    '/taxivideos/france-metro-pov.mp4', // Paris Metro ride
    '/taxivideos/france-vespa-pov.mp4', // Vespa scooter through Paris streets
    '/taxivideos/france-bus-champs-elysees-pov.mp4' // Bus down Champs-Élysées
  ]
};

// =============================================================================
// RUSSIA
// =============================================================================
const russia: Country = {
  id: 'russia',
  name: 'Russia',
  flag: '🇷🇺',
  emoji: '🇷🇺',
  airport: {
    name: 'Sheremetyevo International Airport',
    code: 'SVO',
    city: 'Moscow',
    streetViewCoords: {
      lat: 55.97251,
      lng: 37.4119059,
      heading: 90,
      pitch: 0,
      zoom: 1
    },
    narration: "Welcome to Russia! You've arrived at Moscow's Sheremetyevo Alexander S. Pushkin International Airport, the gateway to the largest country on Earth. From here, you'll explore the grandeur of Red Square, the cultural treasures of St. Petersburg, and the beauty of Kazan.",
    narrationAudio: '/destinationvoices/russia/russiaairport.mp3',
    useStaticImage: true,
    staticImageUrl: '/russia-airport.jpg'
  },
  destinations: [
    {
      id: 'red-square',
      name: 'Red Square & Kremlin',
      city: 'Moscow',
      description: 'The historic heart of Moscow and center of Russian power',
      streetViewCoords: {
        lat: 55.7530585,
        lng: 37.6222068,
        heading: 113.8,
        pitch: -18.37,
        zoom: 1,
        fallbackCoords: [
          { lat: 55.7539, lng: 37.6208 }, // St. Basil's Cathedral view
          { lat: 55.7525, lng: 37.6230 }  // GUM department store side
        ]
      },
      narration: "Welcome to Red Square, the iconic heart of Moscow and all of Russia. This vast plaza has witnessed centuries of history, from royal coronations to military parades. Behind you stands the Kremlin, the fortified complex that has been the seat of Russian power for over 800 years. St. Basil's Cathedral's colorful onion domes rise magnificently before you.",
      narrationAudio: '/destinationvoices/russia/redsquare.mp3',
      photoBackground: '/images/destinations/russia/red-square.jpg',
      ambientSound: '/audio/ambient/russia/square-crowd.mp3'
    },
    {
      id: 'hermitage-museum',
      name: 'State Hermitage Museum',
      city: 'St. Petersburg',
      description: 'One of the world\'s largest and oldest museums',
      streetViewCoords: {
        lat: 59.9400087,
        lng: 30.3160594,
        heading: 301.83,
        pitch: -13.97,
        zoom: 1,
        fallbackCoords: [
          { lat: 59.9395, lng: 30.3155 }, // Palace Square view
          { lat: 59.9405, lng: 30.3165 }  // Neva River embankment
        ]
      },
      narration: "You're now at the State Hermitage Museum in St. Petersburg, Russia's cultural capital. Founded by Catherine the Great in 1764, this museum houses over 3 million works of art spanning from ancient civilizations to modern masterpieces. The Winter Palace, its main building, is itself a stunning example of Baroque architecture with its distinctive mint green and white facade.",
      narrationAudio: '/destinationvoices/russia/hermitage.mp3',
      photoBackground: '/images/destinations/russia/hermitage.jpg',
      ambientSound: '/audio/ambient/russia/museum-echo.mp3'
    },
    {
      id: 'peter-paul-fortress',
      name: 'Peter and Paul Fortress',
      city: 'St. Petersburg',
      description: 'The original citadel of St. Petersburg with its iconic golden spire',
      streetViewCoords: {
        lat: 59.9499026,
        lng: 30.3147388,
        heading: 54.3,
        pitch: -22.35,
        zoom: 1,
        fallbackCoords: [
          { lat: 59.9505, lng: 30.3155 }, // Main gate entrance
          { lat: 59.9495, lng: 30.3140 }  // Cathedral view
        ]
      },
      narration: "Welcome to the Peter and Paul Fortress, the original citadel of St. Petersburg founded by Peter the Great in 1703. This historic fortress on Hare Island features the stunning Peter and Paul Cathedral with its distinctive golden spire soaring 404 feet high. The fortress served as a political prison for centuries and now houses the burial place of Russian emperors from Peter the Great onwards.",
      narrationAudio: '/destinationvoices/russia/peterandpaul.mp3',
      photoBackground: '/images/destinations/russia/peter-paul-fortress.jpg',
      ambientSound: '/audio/ambient/russia/cathedral-atmosphere.mp3'
    }
  ],
  musicTheme: '/audio/music/russia-orchestral.mp3',
  travelVideos: [
    '/taxivideos/Russian_City_Taxi_POV_opt_opt.mp4',
    '/taxivideos/russia-metro-ornate-stations-pov.mp4', // Moscow Metro through ornate stations
    '/taxivideos/russia-marshrutka-pov.mp4' // Marshrutka minibus
  ]
};

// =============================================================================
// UNITED KINGDOM
// =============================================================================
const uk: Country = {
  id: 'uk',
  name: 'United Kingdom',
  flag: '🇬🇧',
  emoji: '🇬🇧',
  airport: {
    name: 'Heathrow Airport',
    code: 'LHR',
    city: 'London',
    streetViewCoords: {
      lat: 51.471374,
      lng: -0.457404,
      heading: 157,
      pitch: 0,
      zoom: 1
    },
    narration: "Welcome to the United Kingdom! You've arrived at Heathrow Airport in London, one of the world's busiest international airports. From royal palaces to ancient mysteries, prepare to explore the history, tradition, and innovation that define Great Britain.",
    narrationAudio: '/destinationvoices/uk/ukairport.mpeg'
  },
  destinations: [
    {
      id: 'eryri-snowdonia',
      name: 'Eryri National Park (Snowdonia)',
      city: 'Wales',
      description: 'Breathtaking Welsh mountains and stunning natural landscapes',
      streetViewCoords: {
        lat: 52.7195878,
        lng: -4.0455212,
        heading: 132,
        pitch: -20,
        zoom: 1,
        fallbackCoords: [
          { lat: 53.0685, lng: -4.0763 }, // Snowdon summit area parking
          { lat: 53.0651, lng: -4.0734 }  // Llanberis path viewpoint
        ]
      },
      narration: "Welcome to Eryri, known in English as Snowdonia National Park, home to Wales' highest peaks and most dramatic landscapes. This stunning wilderness covers 823 square miles of rugged mountains, pristine lakes, and ancient forests. Mount Snowdon, the park's crown jewel, rises 3,560 feet above sea level, offering breathtaking views across Wales and beyond.",
      narrationAudio: '/destinationvoices/uk/eryri.mpeg',
      photoBackground: '/images/destinations/uk/snowdonia.jpg',
      ambientSound: '/audio/ambient/uk/mountain-wind.mp3'
    },
    {
      id: 'buckingham-palace',
      name: 'Buckingham Palace',
      city: 'London',
      description: 'The official residence of the British monarch',
      streetViewCoords: {
        lat: 51.501364,
        lng: -0.14189,
        heading: 230.44,
        pitch: -10.54,
        zoom: 1,
        fallbackCoords: [
          { lat: 51.5008, lng: -0.1415 }, // The Mall public road
          { lat: 51.5013, lng: -0.1410 }, // Victoria Memorial circle
          { lat: 51.5005, lng: -0.1425 }, // Spur Road viewpoint
          { lat: 51.5015, lng: -0.1400 }  // Queen Victoria Memorial
        ]
      },
      narration: "You're standing before Buckingham Palace, the official London residence of the British monarch. With 775 rooms, this grand palace has been the administrative headquarters of the monarchy since 1837. If the Royal Standard flag is flying, it means the King or Queen is in residence. The palace's iconic facade and the famous Changing of the Guard ceremony make it one of the world's most recognized buildings.",
      narrationAudio: '/destinationvoices/uk/buckingham.mpeg',
      photoBackground: '/images/destinations/uk/buckingham-palace.jpg',
      ambientSound: '/audio/ambient/uk/palace-guards.mp3'
    },
    {
      id: 'bath',
      name: 'Bath',
      city: 'Somerset',
      description: 'Historic spa city with stunning Roman baths and Georgian architecture',
      streetViewCoords: {
        lat: 51.3809493,
        lng: -2.3602164,
        heading: 284,
        pitch: -12,
        zoom: 1,
        fallbackCoords: [
          { lat: 51.3811, lng: -2.3590 }, // Roman Baths entrance
          { lat: 51.3863, lng: -2.3657 }  // Royal Crescent
        ]
      },
      narration: "Welcome to Bath, a UNESCO World Heritage city renowned for its Roman baths and stunning Georgian architecture. Founded by the Romans as a thermal spa around 60 AD, Bath's natural hot springs have attracted visitors for over 2,000 years. The honey-colored Georgian buildings, including the iconic Royal Crescent and the magnificent Bath Abbey, make this one of Britain's most beautiful cities.",
      narrationAudio: '/destinationvoices/uk/bath.mpeg',
      photoBackground: '/images/destinations/uk/bath.jpg',
      ambientSound: '/audio/ambient/uk/city-atmosphere.mp3'
    }
  ],
  musicTheme: '/audio/music/uk-classical.mp3',
  travelVideos: [
    '/taxivideos/British_City_Taxi_POV_opt_opt.mp4',
    '/taxivideos/uk-black-cab-london-pov.mp4', // Iconic London black cab
    '/taxivideos/uk-double-decker-bus-pov.mp4' // Double-decker bus tour
  ]
};

// =============================================================================
// EXPORT ALL COUNTRIES
// =============================================================================
export const COUNTRIES: Country[] = [india, usa, france, russia, uk];

// Helper functions
export function getCountryById(id: string): Country | undefined {
  return COUNTRIES.find(country => country.id === id);
}

export function getCountryByName(name: string): Country | undefined {
  return COUNTRIES.find(country => country.name.toLowerCase() === name.toLowerCase());
}

export function getRandomTravelVideo(countryId: string): string {
  const country = getCountryById(countryId);
  if (!country || country.travelVideos.length === 0) {
    return '';
  }
  const randomIndex = Math.floor(Math.random() * country.travelVideos.length);
  return country.travelVideos[randomIndex];
}

// Types are already exported with 'export interface' declarations above
