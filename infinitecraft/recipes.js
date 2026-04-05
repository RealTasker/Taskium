const RECIPES = {
  "Fire+Water": [
    "Steam",
    "♨️"
  ],
  "Fire+Earth": [
    "Lava",
    "🌋"
  ],
  "Fire+Wind": [
    "Smoke",
    "💨"
  ],
  "Water+Wind": [
    "Wave",
    "🌊"
  ],
  "Water+Earth": [
    "Mud",
    "🟫"
  ],
  "Wind+Earth": [
    "Dust",
    "🌫️"
  ],
  "Steam+Fire": [
    "Engine",
    "⚙️"
  ],
  "Steam+Water": [
    "Cloud",
    "☁️"
  ],
  "Steam+Wind": [
    "Fog",
    "🌫️"
  ],
  "Steam+Earth": [
    "Geyser",
    "♨️"
  ],
  "Steam+Steam": [
    "Pressure",
    "💢"
  ],
  "Lava+Water": [
    "Stone",
    "🪨"
  ],
  "Lava+Wind": [
    "Ash",
    "🌋"
  ],
  "Lava+Earth": [
    "Volcano",
    "🌋"
  ],
  "Lava+Lava": [
    "Magma",
    "🔴"
  ],
  "Smoke+Water": [
    "Acid Rain",
    "🌧️"
  ],
  "Smoke+Wind": [
    "Smog",
    "🌫️"
  ],
  "Smoke+Earth": [
    "Gunpowder",
    "💥"
  ],
  "Smoke+Fire": [
    "Signal",
    "🚩"
  ],
  "Stone+Fire": [
    "Metal",
    "⚙️"
  ],
  "Stone+Water": [
    "Sand",
    "🏖️"
  ],
  "Stone+Wind": [
    "Erosion",
    "🌊"
  ],
  "Stone+Earth": [
    "Mountain",
    "⛰️"
  ],
  "Stone+Stone": [
    "Wall",
    "🧱"
  ],
  "Stone+Metal": [
    "Sword",
    "⚔️"
  ],
  "Cloud+Fire": [
    "Lightning",
    "⚡"
  ],
  "Cloud+Water": [
    "Rain",
    "🌧️"
  ],
  "Cloud+Wind": [
    "Storm",
    "⛈️"
  ],
  "Cloud+Earth": [
    "Sky",
    "🌤️"
  ],
  "Cloud+Cloud": [
    "Thunder",
    "⛈️"
  ],
  "Wave+Fire": [
    "Boil",
    "🫧"
  ],
  "Wave+Wind": [
    "Tsunami",
    "🌊"
  ],
  "Wave+Earth": [
    "Beach",
    "🏖️"
  ],
  "Wave+Stone": [
    "Pebble",
    "🪨"
  ],
  "Mud+Fire": [
    "Brick",
    "🧱"
  ],
  "Mud+Wind": [
    "Sandstorm",
    "🌪️"
  ],
  "Mud+Stone": [
    "Clay",
    "🟤"
  ],
  "Mud+Mud": [
    "Swamp",
    "🌿"
  ],
  "Sand+Fire": [
    "Glass",
    "🔮"
  ],
  "Sand+Water": [
    "Beach",
    "🏖️"
  ],
  "Sand+Wind": [
    "Dune",
    "🏜️"
  ],
  "Sand+Stone": [
    "Desert",
    "🏜️"
  ],
  "Metal+Fire": [
    "Steel",
    "⚙️"
  ],
  "Metal+Water": [
    "Rust",
    "🟤"
  ],
  "Metal+Wind": [
    "Bell",
    "🔔"
  ],
  "Metal+Earth": [
    "Mine",
    "⛏️"
  ],
  "Metal+Metal": [
    "Armor",
    "🛡️"
  ],
  "Metal+Stone": [
    "Anvil",
    "⚒️"
  ],
  "Lightning+Water": [
    "Electricity",
    "⚡"
  ],
  "Lightning+Earth": [
    "Thunder",
    "⛈️"
  ],
  "Lightning+Metal": [
    "Robot",
    "🤖"
  ],
  "Lightning+Sand": [
    "Glass",
    "🔮"
  ],
  "Lightning+Fire": [
    "Plasma",
    "🌟"
  ],
  "Lightning+Cloud": [
    "Storm",
    "⛈️"
  ],
  "Glass+Water": [
    "Aquarium",
    "🐟"
  ],
  "Glass+Fire": [
    "Lens",
    "🔍"
  ],
  "Glass+Sand": [
    "Mirror",
    "🪞"
  ],
  "Glass+Metal": [
    "Window",
    "🪟"
  ],
  "Rain+Earth": [
    "Plant",
    "🌱"
  ],
  "Rain+Fire": [
    "Rainbow",
    "🌈"
  ],
  "Rain+Wind": [
    "Hurricane",
    "🌀"
  ],
  "Rain+Sand": [
    "Mud",
    "🟫"
  ],
  "Rain+Stone": [
    "River",
    "🏞️"
  ],
  "Plant+Fire": [
    "Ash",
    "🌋"
  ],
  "Plant+Water": [
    "Algae",
    "🌿"
  ],
  "Plant+Wind": [
    "Seed",
    "🌱"
  ],
  "Plant+Earth": [
    "Tree",
    "🌳"
  ],
  "Plant+Sun": [
    "Fruit",
    "🍎"
  ],
  "Plant+Plant": [
    "Forest",
    "🌲"
  ],
  "Plant+Rain": [
    "Flower",
    "🌸"
  ],
  "Plant+Stone": [
    "Moss",
    "🌿"
  ],
  "Tree+Fire": [
    "Charcoal",
    "⚫"
  ],
  "Tree+Water": [
    "Boat",
    "⛵"
  ],
  "Tree+Wind": [
    "Leaf",
    "🍃"
  ],
  "Tree+Metal": [
    "Axe",
    "🪓"
  ],
  "Tree+Stone": [
    "Log Cabin",
    "🏠"
  ],
  "Tree+Tree": [
    "Forest",
    "🌲"
  ],
  "Forest+Fire": [
    "Wildfire",
    "🔥"
  ],
  "Forest+Water": [
    "Swamp",
    "🌿"
  ],
  "Forest+Wind": [
    "Breeze",
    "🍃"
  ],
  "Forest+Earth": [
    "Jungle",
    "🌴"
  ],
  "Mountain+Fire": [
    "Volcano",
    "🌋"
  ],
  "Mountain+Water": [
    "Lake",
    "🏔️"
  ],
  "Mountain+Wind": [
    "Peak",
    "🏔️"
  ],
  "Mountain+Snow": [
    "Alpine",
    "🏔️"
  ],
  "Mountain+Cloud": [
    "Fog",
    "🌫️"
  ],
  "Sky+Fire": [
    "Sun",
    "☀️"
  ],
  "Sky+Water": [
    "Cloud",
    "☁️"
  ],
  "Sky+Wind": [
    "Breeze",
    "🌬️"
  ],
  "Sky+Night": [
    "Stars",
    "⭐"
  ],
  "Sun+Water": [
    "Rainbow",
    "🌈"
  ],
  "Sun+Earth": [
    "Day",
    "🌅"
  ],
  "Sun+Wind": [
    "Weather",
    "⛅"
  ],
  "Sun+Fire": [
    "Supernova",
    "💥"
  ],
  "Sun+Cloud": [
    "Sunset",
    "🌅"
  ],
  "Sun+Ice": [
    "Water",
    "💧"
  ],
  "Ice+Fire": [
    "Water",
    "💧"
  ],
  "Ice+Wind": [
    "Blizzard",
    "❄️"
  ],
  "Ice+Earth": [
    "Tundra",
    "🌨️"
  ],
  "Ice+Water": [
    "Glacier",
    "🧊"
  ],
  "Ice+Metal": [
    "Frost",
    "❄️"
  ],
  "Ice+Ice": [
    "Snow",
    "❄️"
  ],
  "Snow+Fire": [
    "Water",
    "💧"
  ],
  "Snow+Wind": [
    "Blizzard",
    "❄️"
  ],
  "Snow+Earth": [
    "Snowman",
    "☃️"
  ],
  "Snow+Water": [
    "Slush",
    "💧"
  ],
  "River+Fire": [
    "Steam",
    "♨️"
  ],
  "River+Earth": [
    "Valley",
    "🏞️"
  ],
  "River+Stone": [
    "Canyon",
    "🏜️"
  ],
  "River+Wind": [
    "Current",
    "🌊"
  ],
  "Ocean+Fire": [
    "Island",
    "🏝️"
  ],
  "Ocean+Wind": [
    "Wave",
    "🌊"
  ],
  "Ocean+Earth": [
    "Beach",
    "🏖️"
  ],
  "Ocean+Ice": [
    "Arctic",
    "🧊"
  ],
  "Island+Fire": [
    "Volcano Island",
    "🌋"
  ],
  "Island+Tree": [
    "Jungle",
    "🌴"
  ],
  "Island+Human": [
    "Castaway",
    "🏝️"
  ],
  "Life+Water": [
    "Fish",
    "🐟"
  ],
  "Life+Earth": [
    "Animal",
    "🐾"
  ],
  "Life+Fire": [
    "Phoenix",
    "🔥"
  ],
  "Life+Wind": [
    "Bird",
    "🐦"
  ],
  "Human+Fire": [
    "Cook",
    "👨‍🍳"
  ],
  "Human+Water": [
    "Swimmer",
    "🏊"
  ],
  "Human+Earth": [
    "Farmer",
    "👨‍🌾"
  ],
  "Human+Wind": [
    "Sailor",
    "⛵"
  ],
  "Human+Metal": [
    "Knight",
    "⚔️"
  ],
  "Human+Stone": [
    "Sculptor",
    "🗿"
  ],
  "Human+Plant": [
    "Herbalist",
    "🌿"
  ],
  "Human+Animal": [
    "Hunter",
    "🏹"
  ],
  "Human+Magic": [
    "Wizard",
    "🧙"
  ],
  "Human+Human": [
    "Love",
    "❤️"
  ],
  "Animal+Fire": [
    "Dragon",
    "🐉"
  ],
  "Animal+Water": [
    "Fish",
    "🐟"
  ],
  "Animal+Wind": [
    "Bird",
    "🐦"
  ],
  "Animal+Earth": [
    "Bear",
    "🐻"
  ],
  "Animal+Ice": [
    "Polar Bear",
    "🐻‍❄️"
  ],
  "Animal+Metal": [
    "Armor",
    "🛡️"
  ],
  "Bird+Fire": [
    "Phoenix",
    "🦅"
  ],
  "Bird+Water": [
    "Duck",
    "🦆"
  ],
  "Bird+Wind": [
    "Eagle",
    "🦅"
  ],
  "Bird+Earth": [
    "Nest",
    "🪺"
  ],
  "Bird+Ice": [
    "Penguin",
    "🐧"
  ],
  "Bird+Stone": [
    "Fossil",
    "🦕"
  ],
  "Fish+Fire": [
    "Cooked Fish",
    "🍣"
  ],
  "Fish+Earth": [
    "Turtle",
    "🐢"
  ],
  "Fish+Ice": [
    "Frozen Fish",
    "🐟"
  ],
  "Dragon+Water": [
    "Sea Serpent",
    "🐉"
  ],
  "Dragon+Earth": [
    "Wyvern",
    "🐉"
  ],
  "Dragon+Ice": [
    "Ice Dragon",
    "🧊"
  ],
  "Dragon+Metal": [
    "Armored Dragon",
    "🐉"
  ],
  "Phoenix+Water": [
    "Steam Phoenix",
    "♨️"
  ],
  "Phoenix+Ice": [
    "Phoenix",
    "🔥"
  ],
  "Magic+Fire": [
    "Fireball",
    "🔥"
  ],
  "Magic+Water": [
    "Potion",
    "🧪"
  ],
  "Magic+Earth": [
    "Golem",
    "🗿"
  ],
  "Magic+Wind": [
    "Spell",
    "✨"
  ],
  "Magic+Metal": [
    "Enchanted Sword",
    "⚔️"
  ],
  "Magic+Stone": [
    "Rune",
    "🔮"
  ],
  "Magic+Plant": [
    "Elixir",
    "🧪"
  ],
  "Magic+Human": [
    "Wizard",
    "🧙"
  ],
  "Engine+Water": [
    "Steamship",
    "🚢"
  ],
  "Engine+Fire": [
    "Rocket",
    "🚀"
  ],
  "Engine+Wind": [
    "Turbine",
    "⚙️"
  ],
  "Engine+Metal": [
    "Car",
    "🚗"
  ],
  "Engine+Electricity": [
    "Motor",
    "⚙️"
  ],
  "Electricity+Water": [
    "Electrolysis",
    "⚡"
  ],
  "Electricity+Metal": [
    "Circuit",
    "💡"
  ],
  "Electricity+Sand": [
    "Computer",
    "💻"
  ],
  "Electricity+Glass": [
    "Light Bulb",
    "💡"
  ],
  "Electricity+Human": [
    "Robot",
    "🤖"
  ],
  "Robot+Fire": [
    "Mech",
    "🤖"
  ],
  "Robot+Water": [
    "Submarine",
    "🤿"
  ],
  "Robot+Earth": [
    "Tank",
    "🪖"
  ],
  "Robot+Human": [
    "Cyborg",
    "🤖"
  ],
  "Computer+Human": [
    "Programmer",
    "👨‍💻"
  ],
  "Computer+Magic": [
    "AI",
    "🤖"
  ],
  "Computer+Electricity": [
    "Internet",
    "🌐"
  ],
  "Brick+Brick": [
    "Wall",
    "🧱"
  ],
  "Brick+Wood": [
    "House",
    "🏠"
  ],
  "Brick+Metal": [
    "Castle",
    "🏰"
  ],
  "House+Fire": [
    "Ruins",
    "🏚️"
  ],
  "House+Water": [
    "Houseboat",
    "⛵"
  ],
  "House+Tree": [
    "Treehouse",
    "🌳"
  ],
  "House+Stone": [
    "Castle",
    "🏰"
  ],
  "Castle+Fire": [
    "Siege",
    "🔥"
  ],
  "Castle+Magic": [
    "Enchanted Castle",
    "🏰"
  ],
  "Castle+Human": [
    "Kingdom",
    "👑"
  ],
  "Kingdom+Fire": [
    "War",
    "⚔️"
  ],
  "Kingdom+Human": [
    "Empire",
    "👑"
  ],
  "Kingdom+Magic": [
    "Magical Kingdom",
    "🏰"
  ],
  "Sword+Fire": [
    "Flame Sword",
    "🔥"
  ],
  "Sword+Ice": [
    "Ice Blade",
    "❄️"
  ],
  "Sword+Magic": [
    "Excalibur",
    "⚔️"
  ],
  "Sword+Human": [
    "Warrior",
    "⚔️"
  ],
  "Armor+Fire": [
    "Fire Resistance",
    "🛡️"
  ],
  "Armor+Magic": [
    "Enchanted Armor",
    "🛡️"
  ],
  "Armor+Human": [
    "Knight",
    "⚔️"
  ],
  "Axe+Fire": [
    "Molten Axe",
    "🪓"
  ],
  "Axe+Metal": [
    "Battle Axe",
    "🪓"
  ],
  "Axe+Human": [
    "Lumberjack",
    "👷"
  ],
  "Love+Fire": [
    "Passion",
    "❤️‍🔥"
  ],
  "Love+Water": [
    "Tears",
    "😢"
  ],
  "Love+Human": [
    "Family",
    "👨‍👩‍👧"
  ],
  "Love+Magic": [
    "Charm",
    "💕"
  ],
  "Rainbow+Cloud": [
    "Weather",
    "⛅"
  ],
  "Rainbow+Magic": [
    "Unicorn",
    "🦄"
  ],
  "Rainbow+Water": [
    "Prism",
    "🌈"
  ],
  "Unicorn+Fire": [
    "Alicorn",
    "🦄"
  ],
  "Unicorn+Magic": [
    "Fairy Tale",
    "🧚"
  ],
  "Unicorn+Human": [
    "Legend",
    "📖"
  ],
  "Rocket+Fire": [
    "Launch",
    "🚀"
  ],
  "Rocket+Metal": [
    "Spacecraft",
    "🛸"
  ],
  "Rocket+Human": [
    "Astronaut",
    "👨‍🚀"
  ],
  "Space+Fire": [
    "Star",
    "⭐"
  ],
  "Space+Water": [
    "Comet",
    "☄️"
  ],
  "Space+Earth": [
    "Planet",
    "🪐"
  ],
  "Space+Human": [
    "Astronaut",
    "👨‍🚀"
  ],
  "Star+Star": [
    "Galaxy",
    "🌌"
  ],
  "Star+Fire": [
    "Supernova",
    "💥"
  ],
  "Star+Human": [
    "Astrologer",
    "🔭"
  ],
  "Star+Magic": [
    "Wish",
    "✨"
  ],
  "Galaxy+Fire": [
    "Black Hole",
    "🕳️"
  ],
  "Galaxy+Human": [
    "Alien",
    "👽"
  ],
  "Alien+Human": [
    "Hybrid",
    "👽"
  ],
  "Alien+Metal": [
    "UFO",
    "🛸"
  ],
  "Alien+Magic": [
    "Extraterrestrial",
    "👽"
  ],
  "Volcano+Water": [
    "Island",
    "🏝️"
  ],
  "Volcano+Wind": [
    "Eruption",
    "🌋"
  ],
  "Volcano+Ice": [
    "Stratovolcano",
    "🌋"
  ],
  "Dust+Water": [
    "Mud",
    "🟫"
  ],
  "Dust+Fire": [
    "Spark",
    "✨"
  ],
  "Dust+Wind": [
    "Sandstorm",
    "🌪️"
  ],
  "Dust+Magic": [
    "Fairy Dust",
    "✨"
  ],
  "Charcoal+Fire": [
    "Coal",
    "⚫"
  ],
  "Charcoal+Water": [
    "Ink",
    "🖊️"
  ],
  "Charcoal+Metal": [
    "Steel",
    "⚙️"
  ],
  "Coal+Fire": [
    "Diamond",
    "💎"
  ],
  "Coal+Earth": [
    "Mine",
    "⛏️"
  ],
  "Coal+Metal": [
    "Fuel",
    "⛽"
  ],
  "Diamond+Fire": [
    "Sparkle",
    "✨"
  ],
  "Diamond+Metal": [
    "Drill",
    "⛏️"
  ],
  "Diamond+Human": [
    "Jeweler",
    "💎"
  ],
  "Mine+Human": [
    "Miner",
    "⛏️"
  ],
  "Mine+Metal": [
    "Gold",
    "🥇"
  ],
  "Mine+Stone": [
    "Cave",
    "🕳️"
  ],
  "Gold+Fire": [
    "Molten Gold",
    "🥇"
  ],
  "Gold+Human": [
    "Rich",
    "💰"
  ],
  "Gold+Magic": [
    "Midas Touch",
    "✨"
  ],
  "Potion+Fire": [
    "Explosion",
    "💥"
  ],
  "Potion+Human": [
    "Healer",
    "🧙"
  ],
  "Potion+Magic": [
    "Elixir",
    "🧪"
  ],
  "Clay+Fire": [
    "Pottery",
    "🏺"
  ],
  "Clay+Water": [
    "Slip",
    "🟤"
  ],
  "Clay+Human": [
    "Sculptor",
    "🏺"
  ],
  "Pottery+Fire": [
    "Ceramic",
    "🏺"
  ],
  "Pottery+Water": [
    "Vase",
    "🪴"
  ],
  "Seed+Water": [
    "Sprout",
    "🌱"
  ],
  "Seed+Earth": [
    "Plant",
    "🌱"
  ],
  "Seed+Fire": [
    "Popcorn",
    "🍿"
  ],
  "Fruit+Fire": [
    "Jam",
    "🍓"
  ],
  "Fruit+Water": [
    "Juice",
    "🧃"
  ],
  "Fruit+Human": [
    "Cook",
    "👨‍🍳"
  ],
  "Flower+Water": [
    "Perfume",
    "🌸"
  ],
  "Flower+Fire": [
    "Ash",
    "🌋"
  ],
  "Flower+Human": [
    "Gardener",
    "🌷"
  ],
  "Flower+Magic": [
    "Fairy",
    "🧚"
  ],
  "Cook+Fire": [
    "Chef",
    "👨‍🍳"
  ],
  "Cook+Water": [
    "Soup",
    "🍲"
  ],
  "Cook+Fruit": [
    "Pie",
    "🥧"
  ],
  "Moss+Water": [
    "Algae",
    "🌿"
  ],
  "Moss+Stone": [
    "Ancient Wall",
    "🧱"
  ],
  "Fossil+Fire": [
    "Oil",
    "🛢️"
  ],
  "Fossil+Magic": [
    "Dinosaur",
    "🦕"
  ],
  "Dinosaur+Fire": [
    "T-Rex",
    "🦖"
  ],
  "Dinosaur+Ice": [
    "Frozen Dinosaur",
    "🦕"
  ],
  "Dinosaur+Human": [
    "Museum",
    "🏛️"
  ],
  "Beach+Water": [
    "Ocean",
    "🌊"
  ],
  "Beach+Fire": [
    "Bonfire",
    "🔥"
  ],
  "Beach+Human": [
    "Surfer",
    "🏄"
  ],
  "Lake+Fire": [
    "Hot Spring",
    "♨️"
  ],
  "Lake+Fish": [
    "Fishing",
    "🎣"
  ],
  "Lake+Human": [
    "Swimmer",
    "🏊"
  ],
  "Wind+Fire": [
    "Wildfire",
    "🔥"
  ],
  "Wind+Ice": [
    "Blizzard",
    "❄️"
  ],
  "Gunpowder+Fire": [
    "Explosion",
    "💥"
  ],
  "Gunpowder+Metal": [
    "Gun",
    "🔫"
  ],
  "Gunpowder+Stone": [
    "Cannon",
    "💣"
  ],
  "Explosion+Metal": [
    "Shrapnel",
    "💥"
  ],
  "Explosion+Magic": [
    "Fireworks",
    "🎆"
  ],
  "Fireworks+Sky": [
    "Celebration",
    "🎉"
  ],
  "Fireworks+Human": [
    "Festival",
    "🎊"
  ],
  "Swamp+Life": [
    "Frog",
    "🐸"
  ],
  "Swamp+Fire": [
    "Bog Gas",
    "💨"
  ],
  "Swamp+Magic": [
    "Witch",
    "🧙‍♀️"
  ],
  "Witch+Fire": [
    "Spell",
    "✨"
  ],
  "Witch+Magic": [
    "Coven",
    "🧙‍♀️"
  ],
  "Witch+Human": [
    "Halloween",
    "🎃"
  ],
  "Halloween+Fire": [
    "Jack-o-Lantern",
    "🎃"
  ],
  "Halloween+Magic": [
    "Trick or Treat",
    "🍬"
  ],
  "Jungle+Animal": [
    "Monkey",
    "🐒"
  ],
  "Jungle+Human": [
    "Explorer",
    "🧭"
  ],
  "Desert+Animal": [
    "Camel",
    "🐪"
  ],
  "Desert+Human": [
    "Nomad",
    "🧭"
  ],
  "Tundra+Animal": [
    "Wolf",
    "🐺"
  ],
  "Arctic+Animal": [
    "Polar Bear",
    "🐻‍❄️"
  ],
  "Day+Night": [
    "Time",
    "⏰"
  ],
  "Sun+Moon": [
    "Eclipse",
    "🌑"
  ],
  "Water+Lightning": [
    "Life",
    "🧬"
  ],
  "Mud+Life": [
    "Human",
    "👤"
  ],
  "Earth+Life": [
    "Animal",
    "🐾"
  ],
  "Plant+Life": [
    "Tree",
    "🌳"
  ],
  "Ocean+Life": [
    "Fish",
    "🐟"
  ],
  "Sky+Cloud": [
    "Night",
    "🌙"
  ],
  "Night+Star": [
    "Moon",
    "🌙"
  ],
  "Moon+Magic": [
    "Werewolf",
    "🐺"
  ],
  "Moon+Human": [
    "Moonwalker",
    "🌙"
  ],
  "Pressure+Earth": [
    "Diamond",
    "💎"
  ],
  "Pressure+Water": [
    "Depth",
    "🌊"
  ],
  "Pressure+Metal": [
    "Forge",
    "⚙️"
  ],
  "Acid Rain+Metal": [
    "Corrosion",
    "🟤"
  ],
  "Acid Rain+Stone": [
    "Erosion",
    "🌊"
  ],
  "Acid Rain+Plant": [
    "Damage",
    "🌿"
  ],
  "Smog+Human": [
    "Pollution",
    "🏭"
  ],
  "Smog+City": [
    "Haze",
    "🌫️"
  ],
  "House+House": [
    "Village",
    "🏘️"
  ],
  "Village+House": [
    "Town",
    "🏙️"
  ],
  "Town+Metal": [
    "City",
    "🏙️"
  ],
  "City+Human": [
    "Civilization",
    "🏛️"
  ],
  "City+Magic": [
    "Metropolis",
    "🌆"
  ],
  "Civilization+Fire": [
    "Industry",
    "🏭"
  ],
  "Civilization+Magic": [
    "Renaissance",
    "🎨"
  ],
  "Civilization+Metal": [
    "Technology",
    "⚙️"
  ],
  "Ink+Plant": [
    "Book",
    "📖"
  ],
  "Book+Fire": [
    "Library",
    "📚"
  ],
  "Book+Human": [
    "Scholar",
    "👨‍🎓"
  ],
  "Book+Magic": [
    "Spellbook",
    "📖"
  ],
  "Bell+Wind": [
    "Chime",
    "🔔"
  ],
  "Bell+Metal": [
    "Gong",
    "🔔"
  ],
  "Chime+Magic": [
    "Music",
    "🎵"
  ],
  "Music+Human": [
    "Singer",
    "🎤"
  ],
  "Music+Fire": [
    "Concert",
    "🎸"
  ],
  "Ink+Human": [
    "Artist",
    "🎨"
  ],
  "Glass+Light Bulb": [
    "Prism",
    "🌈"
  ],
  "Magma+Water": [
    "Basalt",
    "🪨"
  ],
  "Basalt+Wind": [
    "Pumice",
    "🪨"
  ],
  "Steel+Fire": [
    "Forge",
    "⚒️"
  ],
  "Steel+Human": [
    "Blacksmith",
    "⚒️"
  ],
  "Steel+Magic": [
    "Mithril",
    "✨"
  ],
  "Warrior+Fire": [
    "Berserker",
    "⚔️"
  ],
  "Warrior+Magic": [
    "Paladin",
    "⚔️"
  ],
  "Knight+Dragon": [
    "Hero",
    "🏆"
  ],
  "Hero+Magic": [
    "Legend",
    "📖"
  ],
  "Hero+Human": [
    "Champion",
    "🏆"
  ],
  "Champion+Magic": [
    "God",
    "⚡"
  ],
  "Fire+Ice": [
    "Water",
    "💧"
  ],
  "Earth+Fire": [
    "Lava",
    "🌋"
  ],
  "Water+Stone": [
    "Sand",
    "🏖️"
  ],
  "Life+Magic": [
    "Miracle",
    "✨"
  ],
  "Miracle+Human": [
    "Saint",
    "😇"
  ],
  "Angel+Fire": [
    "God",
    "⚡"
  ],
  "Angel+Magic": [
    "Heaven",
    "☁️"
  ],
  "Life+Lightning": [
    "Life",
    "🧬"
  ],
  "Human+Angel": [
    "Heaven",
    "☁️"
  ]
};