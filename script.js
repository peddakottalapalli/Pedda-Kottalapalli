const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  };

  const openMenu = () => {
    navigation.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation");
    menuButton.textContent = "×";
  };

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const photoForm = document.getElementById("photo-upload-form");
const photoInput = document.getElementById("photo-input");
const photoCaption = document.getElementById("photo-caption");
const uploadedGallery = document.getElementById("uploaded-gallery");

const storageKey = "pedda-kottalapalli-gallery";
const getStoredValue = (key, fallback = "[]") => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};
const setStoredValue = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const renderGallery = () => {
  if (!uploadedGallery) return;

  let savedPhotos = [];
  try {
    savedPhotos = JSON.parse(getStoredValue(storageKey));
  } catch {
    savedPhotos = [];
  }
  uploadedGallery.innerHTML = "";

  savedPhotos.forEach((photo) => {
    const item = document.createElement("figure");
    item.className = "uploaded-item";

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.caption || "Uploaded village photo";

    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption || "Community photo";

    item.append(image, caption);
    uploadedGallery.appendChild(item);
  });
};

if (photoForm && photoInput && photoCaption && uploadedGallery) {
  photoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const file = photoInput.files[0];
    const caption = photoCaption.value.trim() || "Community contribution";

    if (!file) {
      alert("Please choose a photo before submitting.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = {
        src: reader.result,
        caption,
      };

      let currentPhotos = [];
      try {
        currentPhotos = JSON.parse(getStoredValue(storageKey));
      } catch {
        currentPhotos = [];
      }
      currentPhotos.unshift(imageData);
      if (!setStoredValue(storageKey, JSON.stringify(currentPhotos))) {
        alert(
          "Photos cannot be saved in this browser preview. Please use a web server or hosting to enable local gallery storage.",
        );
        return;
      }

      photoForm.reset();
      renderGallery();
    };

    reader.readAsDataURL(file);
  });

  renderGallery();
}

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const translations = {
  te: {
    "Pedda Kottalapalli | Our Village, Our Pride, Our Family":
      "పెద్ద కొట్టాలపల్లి | మన గ్రామం, మన గర్వం, మన కుటుంబం",
    "Main navigation": "ప్రధాన నావిగేషన్",
    Nov: "నవం",
    Dec: "డిసెం",
    Jan: "జన",
    "Skip to main content": "ప్రధాన విషయానికి వెళ్లండి",
    "OUR VILLAGE � OUR PRIDE": "మన గ్రామం � మన గర్వం",
    Home: "హోమ్",
    About: "మా గురించి",
    Heritage: "వారసత్వం",
    Events: "కార్యక్రమాలు",
    Gallery: "చిత్రాలు",
    Contact: "సంప్రదింపు",
    "OUR VILLAGE, OUR PRIDE, OUR FAMILY": "మన గ్రామం, మన గర్వం, మన కుటుంబం",
    "Rooted in tradition.": "సంప్రదాయాల్లో వేళ్లూనుకుని.",
    "Growing with heart.": "ఆప్యాయతతో ఎదుగుతూ.",
    "Welcoming families, neighbours, visitors and friends to the warmth, culture and community spirit of Pedda Kottalapalli.":
      "పెద్ద కొట్టాలపల్లిలోని ఆప్యాయత, సంస్కృతి, ఐక్యతలకు కుటుంబాలు, పొరుగువారు, సందర్శకులు, స్నేహితులకు స్వాగతం.",
    "Explore the village": "గ్రామాన్ని చూడండి",
    "View gallery": "చిత్రాలను చూడండి",
    Generations: "తరతరాలుగా",
    "of tradition": "సంప్రదాయం",
    Community: "సమాజం",
    "at heart": "మనసులో",
    "Village life": "గ్రామ జీవితం",
    "full of warmth": "ఆప్యాయతతో నిండినది",
    "Our home": "మన ఇల్లు",
    "A PLACE TO BELONG": "మనదైన స్థలం",
    "A village with": "ఒక గ్రామం —",
    "a living story.": "జీవించే కథతో.",
    "Pedda Kottalapalli is more than a location � it is a shared home, shaped by farming traditions, community ties, hospitality and the memories carried from one generation to the next.":
      "పెద్ద కొట్టాలపల్లి ఒక ప్రదేశం మాత్రమే కాదు � వ్యవసాయ సంప్రదాయాలు, బంధాలు, ఆతిథ్యం, తరతరాల జ్ఞాపకాలతో రూపుదిద్దుకున్న మన ఉమ్మడి ఇల్లు.",
    "From family gatherings and local celebrations to the rhythm of day to day life, the spirit of this village is defined by togetherness, pride and care for one another.":
      "కుటుంబ సమావేశాలు, గ్రామ వేడుకలు, రోజువారీ జీవనశైలి � ఇవన్నీ ఐక్యత, గర్వం, పరస్పర శ్రద్ధతో ఈ గ్రామ స్ఫూర్తిని నిలబెడతాయి.",
    "Village history": "గ్రామ చరిత్ర",
    "Rooted in culture. Built on belonging.":
      "సంస్కృతిలో వేళ్లూనుకుని. అనుబంధంతో నిర్మితమై.",
    "Add the verified history of the village here with local landmarks, important milestones and community memories that reflect the real story of Pedda Kottalapalli.":
      "పెద్ద కొట్టాలపల్లి నిజమైన కథను తెలిపే ధృవీకరించిన చరిత్ర, స్థానిక గుర్తులు, ముఖ్య ఘట్టాలు, సామూహిక జ్ఞాపకాలను ఇక్కడ చేర్చండి.",
    "HERITAGE & LIFE": "వారసత్వం & జీవనం",
    "What makes us": "మనల్ని ఇలా చేసినవి",
    "who we are.": "మన గుర్తింపు.",
    "A village shaped by faith, family, land, and the everyday rituals that keep our identity strong.":
      "విశ్వాసం, కుటుంబం, నేల, మన గుర్తింపును నిలిపే రోజువారీ ఆచారాలతో రూపుదిద్దుకున్న గ్రామం.",
    "01 / LAND & LIFE": "01 / నేల & జీవనం",
    "Village roots": "గ్రామ మూలాలు",
    "Fields, families, daily rhythms and the beauty of rural living.":
      "పొలాలు, కుటుంబాలు, నిత్యజీవన లయ, పల్లె జీవన సౌందర్యం.",
    "02 / FAITH & FESTIVALS": "02 / విశ్వాసం & పండుగలు",
    "Tradition and celebration": "సంప్రదాయం, సంబరాలు",
    "Festivals, prayers and shared rituals that strengthen community ties.":
      "సమాజ బంధాలను బలపరిచే పండుగలు, ప్రార్థనలు, ఉమ్మడి ఆచారాలు.",
    "03 / PEOPLE & STORIES": "03 / ప్రజలు & కథలు",
    "Our families": "మన కుటుంబాలు",
    "Stories, honour and friendships that keep the village connected.":
      "గ్రామాన్ని కలిపి ఉంచే కథలు, గౌరవం, స్నేహాలు.",
    "UPCOMING EVENTS": "రాబోయే కార్యక్రమాలు",
    Village: "గ్రామ",
    "moments.": "విశేషాలు.",
    "Celebrations, public notices and community events worth sharing.":
      "పంచుకోదగిన వేడుకలు, ప్రకటనలు, సామూహిక కార్యక్రమాలు.",
    "Village festival gathering": "గ్రామ పండుగ సమావేశం",
    "Celebrate local culture, prayers and shared meals with family and neighbours.":
      "కుటుంబం, పొరుగువారితో స్థానిక సంస్కృతి, ప్రార్థనలు, విందును జరుపుకోండి.",
    "Public notice": "ప్రజా ప్రకటన",
    "Cleanliness & development drive": "పరిశుభ్రత & అభివృద్ధి కార్యక్రమం",
    "Community volunteers come together to improve shared spaces and public areas.":
      "ఉమ్మడి ప్రదేశాలు, ప్రజా ప్రాంతాలను మెరుగుపరచడానికి స్వచ్ఛంద సేవకులు కలుస్తారు.",
    "Family day": "కుటుంబ దినోత్సవం",
    "Heritage and youth gathering": "వారసత్వం, యువత సమావేశం",
    "Stories, music and intergenerational connection to keep traditions alive.":
      "సంప్రదాయాలను సజీవంగా ఉంచే కథలు, సంగీతం, తరాల అనుబంధం.",
    "FACILITIES & SERVICES": "సదుపాయాలు & సేవలు",
    "Helpful for": "అందరికీ",
    "everyone.": "ఉపయోగకరం.",
    "Useful information for residents, families and visitors planning a visit.":
      "నివాసులు, కుటుంబాలు, సందర్శకుల ప్రయాణానికి ఉపయోగకరమైన సమాచారం.",
    Directions: "దారి వివరాలు",
    "Location guidance, route details and nearby landmarks.":
      "స్థాన వివరాలు, మార్గాలు, సమీప గుర్తులు.",
    Healthcare: "ఆరోగ్య సేవలు",
    "Local clinics, medical support and emergency access details.":
      "స్థానిక వైద్యశాలలు, వైద్య సహాయం, అత్యవసర సేవల వివరాలు.",
    Education: "విద్య",
    "Schools and learning centres that serve local families.":
      "స్థానిక కుటుంబాలకు సేవలందించే పాఠశాలలు, విద్యా కేంద్రాలు.",
    "Public services": "ప్రజా సేవలు",
    "Transport, utilities and official contacts for village needs.":
      "రవాణా, మౌలిక సదుపాయాలు, గ్రామ అవసరాల అధికారిక సంప్రదింపులు.",
    "OUR MOMENTS": "మన జ్ఞాపకాలు",
    "Village life,": "గ్రామ జీవితం,",
    "in pictures.": "చిత్రాల్లో.",
    "Real memories, family moments and local pride.":
      "నిజమైన జ్ఞాపకాలు, కుటుంబ క్షణాలు, మన గ్రామ గర్వం.",
    "SHARE A PHOTO": "ఫోటోను పంచుకోండి",
    "Let the community contribute.": "సమాజం తరఫున మీరూ పంచుకోండి.",
    "Uploaded images can be reviewed by the admin before publishing. On a live site, this form can be connected to a backend or email workflow.":
      "అప్‌లోడ్ చేసిన చిత్రాలను ప్రచురణకు ముందు నిర్వాహకులు పరిశీలిస్తారు. ఈ ఫారమ్‌ను వెబ్‌సైట్‌లో ఇమెయిల్ లేదా సర్వర్‌కు అనుసంధానించవచ్చు.",
    "Choose a photo": "ఫోటోను ఎంచుకోండి",
    "Photo title": "ఫోటో శీర్షిక",
    "Family gathering, festival, village view...":
      "కుటుంబ సమావేశం, పండుగ, గ్రామ దృశ్యం...",
    "Upload photo": "ఫోటోను అప్‌లోడ్ చేయండి",
    "PEOPLE & STORIES": "ప్రజలు & కథలు",
    "Voices from": "మన సమాజపు",
    "our community.": "గళాలు.",
    "Family stories, memories and the human side of village life.":
      "కుటుంబ కథలు, జ్ఞాపకాలు, గ్రామ జీవనంలోని మానవీయ కోణం.",
    "�This village is home in every sense. It is the warmth of the people, the traditions we carry and the pride we pass on.�":
      "ఈ గ్రామం అన్ని విధాలా మన ఇల్లు. ప్రజల ఆప్యాయత, మనం కొనసాగించే సంప్రదాయాలు, తరాలకు అందించే గర్వం ఇక్కడ ఉన్నాయి.",
    "Local resident": "స్థానిక నివాసి",
    "�Every celebration here feels like a family gathering. The village spirit is what makes it special for all of us.�":
      "ఇక్కడి ప్రతి వేడుక కుటుంబ సమావేశంలా ఉంటుంది. గ్రామ స్ఫూర్తి దీన్ని మనందరికీ ప్రత్యేకం చేస్తుంది.",
    "Community volunteer": "సాముదాయిక సేవకుడు",
    "Even after living away, coming back feels like reconnecting with our roots and our people":
      "దూరంగా నివసించినా, తిరిగి రావడం మన మూలాలతో, మన ప్రజలతో మళ్లీ కలిసినట్టే ఉంటుంది.",
    "Village family member": "గ్రామ కుటుంబ సభ్యుడు",
    TESTIMONIALS: "అభిప్రాయాలు",
    "What people say": "ప్రజల మాటల్లో",
    "about home.": "మన ఇల్లు.",
    "�A place that feels welcoming from the very first moment. The village spirit is genuine and deeply rooted.�":
      "మొదటి క్షణం నుంచే ఆహ్వానించే ప్రదేశం. ఇక్కడి గ్రామ స్ఫూర్తి నిజమైనది, బలమైనది.",
    "� Visitor from another state": "� మరో రాష్ట్రం నుంచి వచ్చిన సందర్శకుడు",
    "�The warmth, the traditions, and the community care are what make this place feel like family.�":
      "ఆత్మీయత, పరంపరె మత్తు సామూహిక శ్రద్ధ ఈ ప్రదేశాన్ని కుటుంబంలా అనిపించేలా చేస్తాయి.",
    "� Local family member": "� స్థానిక కుటుంబ సభ్యుడు",
    "�This is the kind of place you carry in your heart long after you leave.�":
      "వెళ్లిపోయిన తర్వాత కూడా హృదయంలో నిలిచిపోయే ప్రదేశం ఇది.",
    "� Returning traveller": "� తిరిగి వచ్చిన ప్రయాణికుడు",
    "FIND US": "మమ్మల్ని కనుగొనండి",
    Visit: "సందర్శించండి",
    "Pedda Kottalapalli.": "పెద్ద కొట్టాలపల్లి.",
    "Find Kottalapalli, Andhra Pradesh 515870. Open the map pin for directions and the exact location.":
      "కొట్టాలపల్లి, ఆంధ్రప్రదేశ్ 515870ను కనుగొనండి. మార్గం, ఖచ్చితమైన స్థానం కోసం మ్యాప్ పిన్‌ను తెరవండి.",
    "Open in Google Maps": "Google Mapsలో తెరవండి",
    CONTACT: "సంప్రదింపు",
    "Stay connected with": "మన ఇంటితో",
    "home.": "అనుబంధంగా ఉండండి.",
    "Email us": "ఇమెయిల్ చేయండి",
    "Made with pride for our village and our family.":
      "మన గ్రామం, మన కుటుంబం కోసం గర్వంగా రూపొందించబడింది.",
    "Back to top": "పైకి వెళ్లండి",
    "Choose language": "భాషను ఎంచుకోండి",
    "Open navigation": "నావిగేషన్ తెరవండి",
    "Close navigation": "నావిగేషన్ మూసివేయండి",
    "Village landscape": "గ్రామ దృశ్యం",
    "Agricultural fields": "వ్యవసాయ పొలాలు",
    "Temple and culture": "దేవాలయం, సంస్కృతి",
    "Community gathering": "సామూహిక సమావేశం",
    "Temple setting": "దేవాలయ పరిసరం",
    "Road and village scene": "గ్రామ రహదారి దృశ్యం",
    "Village fields": "గ్రామ పొలాలు",
    "Village highlights": "గ్రామ విశేషాలు",
    "Map showing Kottalapalli, Andhra Pradesh":
      "ఆంధ్రప్రదేశ్‌లోని కొట్టాలపల్లి మ్యాప్",
  },
  kn: {
    "Pedda Kottalapalli | Our Village, Our Pride, Our Family":
      "ಪೆದ್ದ ಕೊಟ್ಟಾಲಪಲ್ಲಿ | ನಮ್ಮ ಗ್ರಾಮ, ನಮ್ಮ ಹೆಮ್ಮೆ, ನಮ್ಮ ಕುಟುಂಬ",
    "Main navigation": "ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್",
    Nov: "ನವೆಂ",
    Dec: "ಡಿಸೆಂ",
    Jan: "ಜನ",
    "Skip to main content": "ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ",
    "OUR VILLAGE � OUR PRIDE": "ನಮ್ಮ ಗ್ರಾಮ � ನಮ್ಮ ಹೆಮ್ಮೆ",
    Home: "ಮುಖಪುಟ",
    About: "ನಮ್ಮ ಬಗ್ಗೆ",
    Heritage: "ಪರಂಪರೆ",
    Events: "ಕಾರ್ಯಕ್ರಮಗಳು",
    Gallery: "ಚಿತ್ರಗಳು",
    Contact: "ಸಂಪರ್ಕ",
    "OUR VILLAGE, OUR PRIDE, OUR FAMILY":
      "ನಮ್ಮ ಗ್ರಾಮ, ನಮ್ಮ ಹೆಮ್ಮೆ, ನಮ್ಮ ಕುಟುಂಬ",
    "Rooted in tradition.": "ಪರಂಪರೆಯಲ್ಲಿ ಬೇರೂರಿ.",
    "Growing with heart.": "ಪ್ರೀತಿಯಿಂದ ಬೆಳೆಯುತ್ತಾ.",
    "Welcoming families, neighbours, visitors and friends to the warmth, culture and community spirit of Pedda Kottalapalli.":
      "ಪೆದ್ದ ಕೊಟ್ಟಾಲಪಲ್ಲಿಯ ಆತ್ಮೀಯತೆ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಮುದಾಯದ ಸ್ಫೂರ್ತಿಗೆ ಕುಟುಂಬಗಳು, ನೆರೆಹೊರೆಯವರು, ಸಂದರ್ಶಕರು ಮತ್ತು ಸ್ನೇಹಿತರಿಗೆ ಸ್ವಾಗತ.",
    "Explore the village": "ಗ್ರಾಮವನ್ನು ನೋಡಿ",
    "View gallery": "ಚಿತ್ರಗಳನ್ನು ನೋಡಿ",
    Generations: "ತಲೆಮಾರುಗಳು",
    "of tradition": "ಪರಂಪರೆಯ",
    Community: "ಸಮುದಾಯ",
    "at heart": "ಹೃದಯದಲ್ಲಿ",
    "Village life": "ಗ್ರಾಮ ಜೀವನ",
    "full of warmth": "ಆತ್ಮೀಯತೆಯಿಂದ ತುಂಬಿದೆ",
    "Our home": "ನಮ್ಮ ಮನೆ",
    "A PLACE TO BELONG": "ನಮ್ಮದೇ ಆದ ಸ್ಥಳ",
    "A village with": "ಒಂದು ಗ್ರಾಮ —",
    "a living story.": "ಜೀವಂತ ಕಥೆಯೊಂದಿಗೆ.",
    "Pedda Kottalapalli is more than a location � it is a shared home, shaped by farming traditions, community ties, hospitality and the memories carried from one generation to the next.":
      "ಪೆದ್ದ ಕೊಟ್ಟಾಲಪಲ್ಲಿ ಒಂದು ಸ್ಥಳ ಮಾತ್ರವಲ್ಲ � ಕೃಷಿ ಪರಂಪರೆ, ಸಮುದಾಯದ ಬಂಧಗಳು, ಆತಿಥ್ಯ ಮತ್ತು ತಲೆಮಾರುಗಳಿಂದ ಬಂದ ನೆನಪುಗಳಿಂದ ರೂಪುಗೊಂಡ ನಮ್ಮೆಲ್ಲರ ಮನೆ.",
    "From family gatherings and local celebrations to the rhythm of day to day life, the spirit of this village is defined by togetherness, pride and care for one another.":
      "ಕುಟುಂಬದ ಕೂಟಗಳು, ಸ್ಥಳೀಯ ಆಚರಣೆಗಳು ಮತ್ತು ದೈನಂದಿನ ಬದುಕಿನ ಲಯ � ಒಗ್ಗಟ್ಟು, ಹೆಮ್ಮೆ ಮತ್ತು ಪರಸ್ಪರ ಕಾಳಜಿಯೇ ಈ ಗ್ರಾಮದ ಆತ್ಮ.",
    "Village history": "ಗ್ರಾಮದ ಇತಿಹಾಸ",
    "Rooted in culture. Built on belonging.":
      "ಸಂಸ್ಕೃತಿಯಲ್ಲಿ ಬೇರು. ಒಗ್ಗಟ್ಟಿನಿಂದ ನಿರ್ಮಾಣ.",
    "Add the verified history of the village here with local landmarks, important milestones and community memories that reflect the real story of Pedda Kottalapalli.":
      "ಪೆದ್ದ ಕೊಟ್ಟಾಲಪಲ್ಲಿಯ ನೈಜ ಕಥೆಯನ್ನು ತೋರಿಸುವ ದೃಢೀಕೃತ ಇತಿಹಾಸ, ಸ್ಥಳೀಯ ಗುರುತುಗಳು, ಪ್ರಮುಖ ಘಟನೆಗಳು ಮತ್ತು ಸಮುದಾಯದ ನೆನಪುಗಳನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ.",
    "HERITAGE & LIFE": "ಪರಂಪರೆ & ಜೀವನ",
    "What makes us": "ನಮ್ಮನ್ನು ರೂಪಿಸಿದವು",
    "who we are.": "ನಮ್ಮ ಗುರುತು.",
    "A village shaped by faith, family, land, and the everyday rituals that keep our identity strong.":
      "ನಂಬಿಕೆ, ಕುಟುಂಬ, ನೆಲ ಮತ್ತು ನಮ್ಮ ಗುರುತನ್ನು ಉಳಿಸುವ ದೈನಂದಿನ ಆಚರಣೆಗಳಿಂದ ರೂಪುಗೊಂಡ ಗ್ರಾಮ.",
    "01 / LAND & LIFE": "01 / ನೆಲ & ಜೀವನ",
    "Village roots": "ಗ್ರಾಮದ ಬೇರುಗಳು",
    "Fields, families, daily rhythms and the beauty of rural living.":
      "ಹೊಲಗಳು, ಕುಟುಂಬಗಳು, ದೈನಂದಿನ ಲಯ ಮತ್ತು ಹಳ್ಳಿಜೀವನದ ಸೌಂದರ್ಯ.",
    "02 / FAITH & FESTIVALS": "02 / ನಂಬಿಕೆ & ಹಬ್ಬಗಳು",
    "Tradition and celebration": "ಪರಂಪರೆ ಮತ್ತು ಸಂಭ್ರಮ",
    "Festivals, prayers and shared rituals that strengthen community ties.":
      "ಸಮುದಾಯದ ಬಾಂಧವ್ಯವನ್ನು ಗಟ್ಟಿಗೊಳಿಸುವ ಹಬ್ಬಗಳು, ಪ್ರಾರ್ಥನೆಗಳು ಮತ್ತು ಆಚರಣೆಗಳು.",
    "03 / PEOPLE & STORIES": "03 / ಜನರು & ಕಥೆಗಳು",
    "Our families": "ನಮ್ಮ ಕುಟುಂಬಗಳು",
    "Stories, honour and friendships that keep the village connected.":
      "ಗ್ರಾಮವನ್ನು ಒಗ್ಗೂಡಿಸುವ ಕಥೆಗಳು, ಗೌರವ ಮತ್ತು ಸ್ನೇಹಗಳು.",
    "UPCOMING EVENTS": "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು",
    Village: "ಗ್ರಾಮದ",
    "moments.": "ಕ್ಷಣಗಳು.",
    "Celebrations, public notices and community events worth sharing.":
      "ಹಂಚಿಕೊಳ್ಳಬಹುದಾದ ಆಚರಣೆಗಳು, ಸಾರ್ವಜನಿಕ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ಸಮುದಾಯ ಕಾರ್ಯಕ್ರಮಗಳು.",
    "Village festival gathering": "ಗ್ರಾಮೋತ್ಸವದ ಕೂಟ",
    "Celebrate local culture, prayers and shared meals with family and neighbours.":
      "ಕುಟುಂಬ ಮತ್ತು ನೆರೆಹೊರೆಯವರೊಂದಿಗೆ ಸ್ಥಳೀಯ ಸಂಸ್ಕೃತಿ, ಪ್ರಾರ್ಥನೆ ಮತ್ತು ಊಟವನ್ನು ಸಂಭ್ರಮಿಸಿ.",
    "Public notice": "ಸಾರ್ವಜನಿಕ ಪ್ರಕಟಣೆ",
    "Cleanliness & development drive": "ಸ್ವಚ್ಛತೆ & ಅಭಿವೃದ್ಧಿ ಅಭಿಯಾನ",
    "Community volunteers come together to improve shared spaces and public areas.":
      "ಸಾಮೂಹಿಕ ಸ್ಥಳಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಪ್ರದೇಶಗಳನ್ನು ಸುಧಾರಿಸಲು ಸ್ವಯಂಸೇವಕರು ಒಂದಾಗುತ್ತಾರೆ.",
    "Family day": "ಕುಟುಂಬ ದಿನ",
    "Heritage and youth gathering": "ಪರಂಪರೆ ಮತ್ತು ಯುವಜನರ ಕೂಟ",
    "Stories, music and intergenerational connection to keep traditions alive.":
      "ಪರಂಪರೆಯನ್ನು ಜೀವಂತವಾಗಿಡುವ ಕಥೆಗಳು, ಸಂಗೀತ ಮತ್ತು ತಲೆಮಾರುಗಳ ನಂಟು.",
    "FACILITIES & SERVICES": "ಸೌಲಭ್ಯಗಳು & ಸೇವೆಗಳು",
    "Helpful for": "ಎಲ್ಲರಿಗೂ",
    "everyone.": "ಸಹಾಯಕ.",
    "Useful information for residents, families and visitors planning a visit.":
      "ನಿವಾಸಿಗಳು, ಕುಟುಂಬಗಳು ಮತ್ತು ಭೇಟಿ ಯೋಜಿಸುವವರಿಗೆ ಉಪಯುಕ್ತ ಮಾಹಿತಿ.",
    Directions: "ದಾರಿ ಮಾಹಿತಿ",
    "Location guidance, route details and nearby landmarks.":
      "ಸ್ಥಳದ ಮಾರ್ಗದರ್ಶನ, ದಾರಿಗಳ ವಿವರ ಮತ್ತು ಸಮೀಪದ ಗುರುತುಗಳು.",
    Healthcare: "ಆರೋಗ್ಯ ಸೇವೆ",
    "Local clinics, medical support and emergency access details.":
      "ಸ್ಥಾನಿಕ ಚಿಕಿತ್ಸಾಲಯಗಳು, ವೈದ್ಯಕೀಯ ನೆರವು ಮತ್ತು ತುರ್ತು ಸೇವೆಗಳ ವಿವರ.",
    Education: "ಶಿಕ್ಷಣ",
    "Schools and learning centres that serve local families.":
      "ಸ್ಥಾನಿಕ ಕುಟುಂಬಗಳಿಗೆ ಸೇವೆ ನೀಡುವ ಶಾಲೆಗಳು ಮತ್ತು ಕಲಿಕಾ ಕೇಂದ್ರಗಳು.",
    "Public services": "ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು",
    "Transport, utilities and official contacts for village needs.":
      "ಸಾರಿಗೆ, ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಗ್ರಾಮದ ಅಗತ್ಯಗಳ ಅಧಿಕೃತ ಸಂಪರ್ಕಗಳು.",
    "OUR MOMENTS": "ನಮ್ಮ ಕ್ಷಣಗಳು",
    "Village life,": "ಗ್ರಾಮ ಜೀವನ,",
    "in pictures.": "ಚಿತ್ರಗಳಲ್ಲಿ.",
    "Real memories, family moments and local pride.":
      "ನೈಜ ನೆನಪುಗಳು, ಕುಟುಂಬದ ಕ್ಷಣಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಹೆಮ್ಮೆ.",
    "SHARE A PHOTO": "ಚಿತ್ರ ಹಂಚಿಕೊಳ್ಳಿ",
    "Let the community contribute.": "ಸಮುದಾಯದ ಕೊಡುಗೆಗೆ ಸ್ವಾಗತ.",
    "Uploaded images can be reviewed by the admin before publishing. On a live site, this form can be connected to a backend or email workflow.":
      "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರಗಳನ್ನು ಪ್ರಕಟಿಸುವ ಮೊದಲು ನಿರ್ವಾಹಕರು ಪರಿಶೀಲಿಸಬಹುದು. ಈ ಫಾರ್ಮ್ ಅನ್ನು ಇಮೇಲ್ ಅಥವಾ ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಬಹುದು.",
    "Choose a photo": "ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ",
    "Photo title": "ಚಿತ್ರದ ಶೀರ್ಷಿಕೆ",
    "Family gathering, festival, village view...":
      "ಕುಟುಂಬ ಕೂಟ, ಹಬ್ಬ, ಗ್ರಾಮದ ನೋಟ...",
    "Upload photo": "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    "PEOPLE & STORIES": "ಜನರು & ಕಥೆಗಳು",
    "Voices from": "ನಮ್ಮ ಸಮುದಾಯದ",
    "our community.": "ಧ್ವನಿಗಳು.",
    "Family stories, memories and the human side of village life.":
      "ಕುಟುಂಬದ ಕಥೆಗಳು, ನೆನಪುಗಳು ಮತ್ತು ಗ್ರಾಮ ಜೀವನದ ಮಾನವೀಯ ಮುಖ.",
    "�This village is home in every sense. It is the warmth of the people, the traditions we carry and the pride we pass on.�":
      "ಈ ಗ್ರಾಮವೇ ಎಲ್ಲ ಅರ್ಥದಲ್ಲೂ ಮನೆ. ಜನರ ಆತ್ಮೀಯತೆ, ನಾವು ಉಳಿಸುವ ಪರಂಪರೆ ಮತ್ತು ಮುಂದಿನ ಪೀಳಿಗೆಗೆ ನೀಡುವ ಹೆಮ್ಮೆ ಇದರ ವಿಶೇಷ.",
    "Local resident": "ಸ್ಥಾನಿಕ ನಿವಾಸಿ",
    "Every celebration here feels like a family gathering. The village spirit is what makes it special for all of us.�":
      "ಇಲ್ಲಿನ ಪ್ರತಿಯೊಂದು ಆಚರಣೆಯೂ ಕುಟುಂಬದ ಕೂಟದಂತೆ ಭಾಸವಾಗುತ್ತದೆ. ಗ್ರಾಮದ ಸ್ಫೂರ್ತಿಯೇ ಇದನ್ನು ನಮಗೆಲ್ಲ ವಿಶೇಷವಾಗಿಸುತ್ತದೆ.",
    "Community volunteer": "ಸಮುದಾಯ ಸ್ವಯಂಸೇವಕ",
    "�Even after living away, coming back feels like reconnecting with our roots and our people.�":
      "ದೂರದಲ್ಲಿ ವಾಸಿಸಿದರೂ ಮರಳಿ ಬಂದಾಗ ನಮ್ಮ ಬೇರುಗಳು ಮತ್ತು ಜನರೊಂದಿಗೆ ಮತ್ತೆ ಬೆಸೆದಂತಾಗುತ್ತದೆ.",
    "Village family member": "ಗ್ರಾಮದ ಕುಟುಂಬ ಸದಸ್ಯ",
    TESTIMONIALS: "ಅಭಿಪ್ರಾಯಗಳು",
    "What people say": "ಜನರ ಮಾತಿನಲ್ಲಿ",
    "about home.": "ನಮ್ಮ ಮನೆ.",
    "�A place that feels welcoming from the very first moment. The village spirit is genuine and deeply rooted.�":
      "ಮೊದಲ ಕ್ಷಣದಿಂದಲೇ ಆತ್ಮೀಯವಾಗಿ ಸ್ವಾಗತಿಸುವ ಸ್ಥಳ. ಗ್ರಾಮದ ಸ್ಫೂರ್ತಿ ನೈಜವೂ ಆಳವಾಗಿ ಬೇರೂರಿದುದೂ ಆಗಿದೆ.",
    "� Visitor from another state": "� ಬೇರೆ ರಾಷ్ట్ರం నుంచి వచ్చిన సందర్శకుడు",
    "�The warmth, the traditions, and the community care are what make this place feel like family.�":
      "ಆತ್ಮೀಯತೆ, ಪರಂಪರೆ ಮತ್ತು ಸಮುದಾಯದ ಕಾಳಜಿಯೇ ಈ ಸ್ಥಳವನ್ನು ಕುಟುಂಬದಂತೆ ಮಾಡುತ್ತವೆ.",
    "� Local family member": "� ಸ್ಥಾನಿಕ ಕುಟುಂಬದ ಸದಸ್ಯ",
    "�This is the kind of place you carry in your heart long after you leave.�":
      "ಬಿಟ್ಟು ಹೋದ ಮೇಲೂ ಹೃದಯದಲ್ಲಿ ಉಳಿಯುವಂತಹ ಸ್ಥಳ ಇದು.",
    "� Returning traveller": "� ತಿರಿಗಿ ಬಂದ ಪ್ರಯಾಣಿಕ",
    "FIND US": "ನಮ್ಮನ್ನು ಹುಡುಕಿ",
    Visit: "ಭೇಟಿ ನೀಡಿ",
    "Pedda Kottalapalli.": "ಪೆದ್ದ ಕೊಟ್ಟಾಲಪಲ್ಲಿ.",
    "Find Kottalapalli, Andhra Pradesh 515870. Open the map pin for directions and the exact location.":
      "ಕೊಟ್ಟಾಲಪಲ್ಲಿ, ಆಂಧ್ರಪ್ರದೇಶ 515870 ಅನ್ನು ಹುಡುಕಿ. ದಾರಿ ಮತ್ತು ನಿಖರ ಸ್ಥಳಕ್ಕಾಗಿ ನಕ್ಷೆಯ ಪಿನ್ ತೆರೆಯಿರಿ.",
    "Open in Google Maps": "Google Mapsನಲ್ಲಿ ತೆರೆಯಿರಿ",
    CONTACT: "ಸಂಪರ್ಕ",
    "Stay connected with": "ನಮ್ಮ ಮನೆಯೊಂದಿಗೆ",
    "home.": "ಸಂಪರ್ಕದಲ್ಲಿರಿ.",
    "Email us": "ಇಮೇಲ್ ಮಾಡಿ",
    "Made with pride for our village and our family.":
      "ನಮ್ಮ ಗ್ರಾಮ ಮತ್ತು ಕುಟುಂಬಕ್ಕಾಗಿ ಹೆಮ್ಮೆಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ.",
    "Back to top": "ಮೇಲಕ್ಕೆ ಹೋಗಿ",
    "Choose language": "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    "Open navigation": "ನ್ಯಾವಿಗೇಶನ್ ತೆರೆಯಿರಿ",
    "Close navigation": "ನ್ಯಾವಿಗೇಶನ್ ಮುಚ್ಚಿ",
    "Village landscape": "ಗ್ರಾಮದ ನೋಟ",
    "Agricultural fields": "ಕೃಷಿ ಹೊಲಗಳು",
    "Temple and culture": "ದೇವಾಲಯ ಮತ್ತು ಸಂಸ್ಕೃತಿ",
    "Community gathering": "ಸಮುದಾಯದ ಕೂಟ",
    "Temple setting": "ದೇವಾಲಯದ ಪರಿಸರ",
    "Road and village scene": "ಗ್ರಾಮ ರಹದಾರಿ ದೃಶ್ಯ",
    "Village fields": "ಗ್ರಾಮದ ಹೊಲಗಳು",
    "Village highlights": "ಗ್ರಾಮದ ವಿಶೇಷಗಳು",
    "Map showing Kottalapalli, Andhra Pradesh":
      "ಆಂಧ್ರಪ್ರದೇಶದ ಕೊಟ್ಟಾಲಪಲ್ಲಿಯ ನಕ್ಷೆ",
  },
  hi: {
    "Pedda Kottalapalli | Our Village, Our Pride, Our Family":
      "पेद्दा कोट्टालपल्ली | हमारा गाँव, हमारा गौरव, हमारा परिवार",
    "Main navigation": "मुख्य नेविगेशन",
    Nov: "नव॰",
    Dec: "दिस॰",
    Jan: "जन॰",
    "Skip to main content": "मुख्य सामग्री पर जाएँ",
    "OUR VILLAGE � OUR PRIDE": "हमारा गाँव � हमारा गौरव",
    Home: "होम",
    About: "परिचय",
    Heritage: "विरासत",
    Events: "कार्यक्रम",
    Gallery: "चित्रावली",
    Contact: "संपर्क",
    "OUR VILLAGE, OUR PRIDE, OUR FAMILY":
      "हमारा गाँव, हमारा गौरव, हमारा परिवार",
    "Rooted in tradition.": "परंपराओं से जुड़ा।",
    "Growing with heart.": "अपनत्व के साथ आगे बढ़ता।",
    "Welcoming families, neighbours, visitors and friends to the warmth, culture and community spirit of Pedda Kottalapalli.":
      "पेद्दा कोट्टालापल्ली की आत्मीयता, संस्कृति और सामुदायिक भावना में परिवारों, पड़ोसियों, आगंतुकों और मित्रों का स्वागत है।",
    "Explore the village": "गाँव देखें",
    "View gallery": "चित्र देखें",
    Generations: "पीढ़ियाँ",
    "of tradition": "परंपराओं की",
    Community: "समुदाय",
    "at heart": "दिल में",
    "Village life": "गाँव का जीवन",
    "full of warmth": "अपनत्व से भरा",
    "Our home": "हमारा घर",
    "A PLACE TO BELONG": "अपनापन का स्थान",
    "A village with": "एक गाँव,",
    "a living story.": "एक जीवंत कहानी।",
    "Pedda Kottalapalli is more than a location � it is a shared home, shaped by farming traditions, community ties, hospitality and the memories carried from one generation to the next.":
      "पेद्दा कोट्टालपल्ली केवल एक स्थान नहीं � यह खेती की परंपराओं, सामुदायिक संबंधों, आतिथ्य और पीढ़ियों से चली आ रही यादों से बना हमारा साझा घर है।",
    "From family gatherings and local celebrations to the rhythm of day to day life, the spirit of this village is defined by togetherness, pride and care for one another.":
      "पारिवारिक मिलन और स्थानीय उत्सवों से लेकर रोज़मर्रा के जीवन तक, एकता, गौरव और परस्पर देखभाल इस गाँव की पहचान हैं।",
    "Village history": "गाँव का इतिहास",
    "Rooted in culture. Built on belonging.":
      "संस्कृति में जड़ें। अपनत्व से निर्मित।",
    "Add the verified history of the village here with local landmarks, important milestones and community memories that reflect the real story of Pedda Kottalapalli.":
      "पेद्दा कोट्टालपल्ली की वास्तविक कहानी बताने वाला प्रमाणित इतिहास, स्थानीय स्थल, महत्वपूर्ण घटनाएँ और सामुदायिक यादें यहाँ जोड़ें।",
    "HERITAGE & LIFE": "विरासत और जीवन",
    "What makes us": "जो हमें बनाता है",
    "who we are.": "हमारी पहचान।",
    "A village shaped by faith, family, land, and the everyday rituals that keep our identity strong.":
      "आस्था, परिवार, भूमि और हमारी पहचान बनाए रखने वाली रोज़मर्रा की परंपराओं से बना गाँव।",
    "01 / LAND & LIFE": "01 / भूमि और जीवन",
    "Village roots": "गाँव की जड़ें",
    "Fields, families, daily rhythms and the beauty of rural living.":
      "खेत, परिवार, रोज़मर्रा की लय और ग्रामीण जीवन की सुंदरता।",
    "02 / FAITH & FESTIVALS": "02 / आस्था और त्योहार",
    "Tradition and celebration": "परंपरा और उत्सव",
    "Festivals, prayers and shared rituals that strengthen community ties.":
      "समुदाय के रिश्तों को मजबूत करने वाले त्योहार, प्रार्थनाएँ और साझा रीति-रिवाज।",
    "03 / PEOPLE & STORIES": "03 / लोग और कहानियाँ",
    "Our families": "हमारे परिवार",
    "Stories, honour and friendships that keep the village connected.":
      "गाँव को जोड़े रखने वाली कहानियाँ, सम्मान और मित्रता।",
    "UPCOMING EVENTS": "आगामी कार्यक्रम",
    Village: "गाँव के",
    "moments.": "पल।",
    "Celebrations, public notices and community events worth sharing.":
      "साझा करने योग्य उत्सव, सार्वजनिक सूचनाएँ और सामुदायिक कार्यक्रम।",
    "Village festival gathering": "गाँव का उत्सव समारोह",
    "Celebrate local culture, prayers and shared meals with family and neighbours.":
      "परिवार और पड़ोसियों के साथ स्थानीय संस्कृति, प्रार्थनाओं और सामूहिक भोजन का उत्सव मनाएँ।",
    "Public notice": "सार्वजनिक सूचना",
    "Cleanliness & development drive": "स्वच्छता और विकास अभियान",
    "Community volunteers come together to improve shared spaces and public areas.":
      "साझा स्थानों और सार्वजनिक क्षेत्रों को बेहतर बनाने के लिए समुदाय के स्वयंसेवक साथ आते हैं।",
    "Family day": "परिवार दिवस",
    "Heritage and youth gathering": "विरासत और युवा मिलन",
    "Stories, music and intergenerational connection to keep traditions alive.":
      "परंपराओं को जीवित रखने वाली कहानियाँ, संगीत और पीढ़ियों का जुड़ाव।",
    "FACILITIES & SERVICES": "सुविधाएँ और सेवाएँ",
    "Helpful for": "सबके लिए",
    "everyone.": "उपयोगी।",
    "Useful information for residents, families and visitors planning a visit.":
      "निवासियों, परिवारों और यात्रा की योजना बना रहे आगंतुकों के लिए उपयोगी जानकारी।",
    Directions: "दिशा-निर्देश",
    "Location guidance, route details and nearby landmarks.":
      "स्थान की जानकारी, रास्ते और आसपास के प्रमुख स्थल।",
    Healthcare: "स्वास्थ्य सेवा",
    "Local clinics, medical support and emergency access details.":
      "स्थानीय क्लिनिक, चिकित्सा सहायता और आपातकालीन सेवाओं का विवरण।",
    Education: "शिक्षा",
    "Schools and learning centres that serve local families.":
      "स्थानीय परिवारों के लिए स्कूल और शिक्षा केंद्र।",
    "Public services": "सार्वजनिक सेवाएँ",
    "Transport, utilities and official contacts for village needs.":
      "गाँव की ज़रूरतों के लिए परिवहन, सुविधाएँ और आधिकारिक संपर्क।",
    "OUR MOMENTS": "हमारे पल",
    "Village life,": "गाँव का जीवन,",
    "in pictures.": "चित्रों में।",
    "Real memories, family moments and local pride.":
      "सच्ची यादें, पारिवारिक पल और अपने गाँव का गौरव।",
    "SHARE A PHOTO": "तस्वीर साझा करें",
    "Let the community contribute.": "समुदाय को योगदान देने दें।",
    "Uploaded images can be reviewed by the admin before publishing. On a live site, this form can be connected to a backend or email workflow.":
      "प्रकाशित करने से पहले व्यवस्थापक अपलोड की गई तस्वीरों की समीक्षा कर सकते हैं। इस फ़ॉर्म को ईमेल या सर्वर से जोड़ा जा सकता है।",
    "Choose a photo": "तस्वीर चुनें",
    "Photo title": "तस्वीर का शीर्षक",
    "Family gathering, festival, village view...":
      "परिवार का मिलन, त्योहार, गाँव का दृश्य...",
    "Upload photo": "तस्वीर अपलोड करें",
    "PEOPLE & STORIES": "लोग और कहानियाँ",
    "Voices from": "हमारे समुदाय की",
    "our community.": "आवाज़ें।",
    "Family stories, memories and the human side of village life.":
      "परिवार की कहानियाँ, यादें और गाँव के जीवन का मानवीय पक्ष।",
    "�This village is home in every sense. It is the warmth of the people, the traditions we carry and the pride we pass on.�":
      "यह गाँव हर मायने में घर है। यहाँ के लोगों की आत्मीयता, हमारी परंपराएँ और अगली पीढ़ी को दिया जाने वाला गौरव इसे खास बनाते हैं।",
    "Local resident": "स्थानीय निवासी",
    "�Every celebration here feels like a family gathering. The village spirit is what makes it special for all of us.�":
      "यहाँ हर उत्सव परिवार के मिलन जैसा लगता है। गाँव की भावना ही इसे हम सभी के लिए खास बनाती है।",
    "Community volunteer": "सामुदायिक स्वयंसेवक",
    "�Even after living away, coming back feels like reconnecting with our roots and our people.�":
      "दूर रहने के बाद भी लौटना अपनी जड़ों और अपने लोगों से फिर जुड़ने जैसा लगता है।",
    "Village family member": "गाँव के परिवार के सदस्य",
    TESTIMONIALS: "लोगों की राय",
    "What people say": "लोग क्या कहते हैं",
    "about home.": "अपने घर के बारे में।",
    "�A place that feels welcoming from the very first moment. The village spirit is genuine and deeply rooted.�":
      "पहले ही पल से अपनापन महसूस कराने वाली जगह। गाँव की भावना सच्ची और गहरी जड़ों वाली है।",
    "� Visitor from another state": "� दूसरे राज्य से आए आगंतुक",
    "�The warmth, the traditions, and the community care are what make this place feel like family.�":
      "आत्मीयता, परंपराएँ और सामुदायिक देखभाल इस जगह को परिवार जैसा बनाते हैं।",
    "� Local family member": "� स्थानीय परिवार के सदस्य",
    "�This is the kind of place you carry in your heart long after you leave.�":
      "यह ऐसी जगह है जो जाने के बहुत बाद भी दिल में रहती है।",
    "� Returning traveller": "� लौटकर आए यात्री",
    "FIND US": "हम तक पहुँचें",
    Visit: "आइए",
    "Pedda Kottalapalli.": "पेद्दा कोट्टालपल्ली।",
    "Find Kottalapalli, Andhra Pradesh 515870. Open the map pin for directions and the exact location.":
      "कोट्टालपल्ली, आंध्र प्रदेश 515870 खोजें। रास्ते और सटीक स्थान के लिए मानचित्र पिन खोलें।",
    "Open in Google Maps": "Google Maps में खोलें",
    CONTACT: "संपर्क",
    "Stay connected with": "अपने घर से जुड़े",
    "home.": "रहें।",
    "Email us": "ईमेल करें",
    "Made with pride for our village and our family.":
      "हमारे गाँव और परिवार के लिए गर्व से बनाया गया।",
    "Back to top": "ऊपर जाएँ",
    "Choose language": "भाषा चुनें",
    "Open navigation": "नेविगेशन खोलें",
    "Close navigation": "नेविगेशन बंद करें",
    "Village landscape": "गाँव का दृश्य",
    "Agricultural fields": "खेती के खेत",
    "Temple and culture": "मंदिर और संस्कृति",
    "Community gathering": "सामुदायिक मिलन",
    "Temple setting": "मंदिर परिसर",
    "Road and village scene": "सड़क और गाँव का दृश्य",
    "Village fields": "गाँव के खेत",
    "Village highlights": "गाँव की झलकियाँ",
    "Map showing Kottalapalli, Andhra Pradesh":
      "आंध्र प्रदेश के कोट्टालपल्ली का मानचित्र",
  },
};

const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
const languageSelect = document.getElementById("language-select");
const localize = (language) => {
  const dictionary = translations[language] || {};
  const textWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
  );

  while (textWalker.nextNode()) {
    const textNode = textWalker.currentNode;
    if (!originalTextNodes.has(textNode)) {
      originalTextNodes.set(textNode, textNode.textContent);
    }

    const original = originalTextNodes.get(textNode);
    const key = original.trim().replace(/\s+/g, " ");
    if (dictionary[key]) {
      textNode.textContent = dictionary[key];
    } else {
      textNode.textContent = original;
    }
  }

  document
    .querySelectorAll("[aria-label], [title], [placeholder]")
    .forEach((element) => {
      ["aria-label", "title", "placeholder"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (!value) return;
        let savedAttributes = originalAttributes.get(element);
        if (!savedAttributes) {
          savedAttributes = {};
          originalAttributes.set(element, savedAttributes);
        }
        if (!savedAttributes[attribute]) savedAttributes[attribute] = value;
        const original = savedAttributes[attribute];
        element.setAttribute(attribute, dictionary[original] || original);
      });
    });

  document.documentElement.lang = language;
  document.title =
    dictionary["Pedda Kottalapalli | Our Village, Our Pride, Our Family"] ||
    "Pedda Kottalapalli | Our Village, Our Pride, Our Family";
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const originalDescription =
      "Pedda Kottalapalli � a warm, premium village community landing page celebrating heritage, people, events, and local life.";
    description.content =
      dictionary[originalDescription] || originalDescription;
  }
};

if (languageSelect) {
  let savedLanguage = "en";
  try {
    savedLanguage = localStorage.getItem("pedda-kottalapalli-language") || "en";
  } catch {
    savedLanguage = "en";
  }
  languageSelect.value = ["en", "te", "kn", "hi"].includes(savedLanguage)
    ? savedLanguage
    : "en";
  localize(languageSelect.value);

  languageSelect.addEventListener("change", () => {
    setStoredValue("pedda-kottalapalli-language", languageSelect.value);
    localize(languageSelect.value);
  });
}
