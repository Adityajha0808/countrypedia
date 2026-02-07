let chatHistory = [];
let currentChatCountry = null;

// World Bank API endpoints
const endpoint = [
    "SP.POP.TOTL",
    "NY.GDP.MKTP.CD",
    "NY.GDP.PCAP.CD",
    "NY.GDP.MKTP.PP.CD",
    "FP.CPI.TOTL.ZG",
    "GC.DOD.TOTL.GD.ZS",
    "NE.EXP.GNFS.CD",
    "NE.IMP.GNFS.CD"
];

// Field names to display data
const attributeName = [
    "population",
    "nominal-gdp",
    "gdp-per-capita",
    "gdp-ppp",
    "inflation",
    "debt-to-gdp",
    "exports",
    "imports"
];

// Chat suggestions
const chipSuggestions = [
  "What currency does this country use?",
  "Share the detailed economic outlook.",
  "How this country has changed compared to 1970s?",
  "What are some future predictions about this country?",
  "What are the top tourist attractions?"
];

const chatbotErrorMsg = 'Error accessing chatbot now, please try again later!';

const chatInput = document.getElementById("chat-input");
const suggestionsContainer = document.getElementById("chat-suggestions");
const sendBtn = document.getElementById("chat-send-btn");

document.addEventListener("DOMContentLoaded", function () {
    const apiUrlCountries = "https://api.worldbank.org/v2/country?format=json";
    const dateApiUrl = "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=1&strdate=2050-01-01";

    const searchDropdown = document.getElementById("search-country");
    const yearSelect = document.getElementById("yearSelect");
    const submitButton = document.getElementById("submitButton");
    const sendEmailButton = document.getElementById('sendEmailButton');

    const nightModeToggle = document.getElementById('nightModeToggle');
    const navbarNightMode = document.querySelector('.navbar-night-mode');
    const headerNightMode = document.querySelectorAll('.header-night-mode');
    const btnWhiteOutline = document.querySelector('.btn-white-outline');
    const articleSection = document.querySelector('.cid-u2HsKV6qvx');
    const cardWrapper = document.querySelectorAll('.card-wrapper');
    const worldBankLink = document.querySelector('.world-bank-link');
    const featureNightMode = document.querySelectorAll('.feature-night-mode');
    const featureSection = document.querySelector('.cid-u2HsKV6ukM');
    const btnPrimary = document.querySelectorAll('.btn-primary');
    const formSelect = document.querySelectorAll('.form-select');
    const overlayTitle = document.querySelectorAll('.overlay-title');
    const overlayText1 = document.querySelectorAll('.overlay-text1');
    const overlayText2 = document.querySelectorAll('.overlay-text2');
    const header2Section = document.querySelector('.cid-u2HsKV7TDJ');
    const contactSection = document.querySelector('.cid-u2HsKV88ir');
    const feature2Section = document.querySelector('.cid-u2HsKV7LQr');
    const feature3Section = document.querySelector('.cid-u2HsKV7prD');
    const formInput = document.querySelectorAll('.form-input');

    let selectedCountry = "";
    let selectedYear = "";
    let latestYear = "";

    // Function to fetch countries with pagination
    const fetchCountries = (page = 1) => {
        const url = `${apiUrlCountries}&page=${page}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const countries = data[1];

                // Process and display the list of countries with codes
                countries.forEach(country => {
                    const { name, id } = country;
                    const option = createOption(`${name} (${id})`);
                    searchDropdown.appendChild(option);
                });

                // Check if there are more pages and fetch them recursively
                const totalPages = data[0].pages;
                if (page < totalPages) {
                    fetchCountries(page + 1);
                }

                selectedCountry = searchDropdown.value;
            })
            .catch(error => console.error("Error fetching countries:", error));
    };

    // Event listener for dropdown selection
    searchDropdown.addEventListener("change", function () {
        selectedCountry = searchDropdown.value;
    });

    // Event listener for year dropdown selection
    yearSelect.addEventListener("change", function () {
        selectedYear = yearSelect.value;
    });

    // Event listener for Search button click
    submitButton.addEventListener("click", function () {
        // If no country is selected, default to the first one in the dropdown
        if (!selectedCountry && searchDropdown.options.length > 0) {
            selectedCountry = searchDropdown.options[0].value;
        }
        // If no year is selected, default to the latest year
        if(!selectedYear) {
            selectedYear = latestYear;
        }
        handleButtonClick(selectedCountry, selectedYear);
    });

    // Event listener for Chat Send button click
    document.getElementById("chat-send-btn").addEventListener("click", sendChatMessage);

    // Event listener for Enter key press in chat input
    document.getElementById("chat-input").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendChatMessage();
        }
    });

    // Event listener for Send Email button click
    sendEmailButton.addEventListener('click', handleSendEmailButtonClick);

    // Initiate the fetch country
    fetchCountries();

    // Set default country
    setTimeout(() => {
        if (!currentChatCountry && searchDropdown.options.length > 0) {
            const countryInfo = getCountryInfo(searchDropdown.options[0].value);
            currentChatCountry = countryInfo.name;
    
            document.getElementById("chat-messages").innerHTML = `
              <div class="chat-message chat-ai">
                Ask me anything about <strong>${currentChatCountry}</strong>.
              </div>
            `;

            // Render chatbot suggestions
            renderChatSuggestions();
        }
    }, 500);

    // Fetch Year data and populate Year dropdown
    fetch(dateApiUrl)
        .then(response => response.json())
        .then(data => {
            latestYear = data[1][0].date;
            populateYearDropdown(latestYear);
        })
        .catch(error => console.error("Error fetching Year data:", error));


    // Load night mode preference from localStorage
    const isDayMode = JSON.parse(localStorage.getItem('dayMode'));
    if (isDayMode) {
        document.body.classList.add('night-mode');
        navbarNightMode.classList.add('navbar-night-mode-add');
        btnWhiteOutline.classList.add('btn-white-outline-add');
        headerNightMode.forEach(function(element) {
            element.classList.add('header-night-mode-add');
        });
        articleSection.classList.add('cid-u2HsKV6qvx-add');
        cardWrapper.forEach(function(element) {
            element.classList.add('card-wrapper-add');
        });
        worldBankLink.classList.add('world-bank-link-add');
        featureNightMode.forEach(function(element) {
            element.classList.add('feature-night-mode-add');
        });
        featureSection.classList.add('cid-u2HsKV6ukM-add');
        btnPrimary.forEach(function(element) {
            element.classList.add('btn-primary-add');
        });
        formSelect.forEach(function(element) {
            element.classList.add('form-select-add');
        });
        overlayTitle.forEach(function(element) {
            element.classList.add('overlay-title-add');
        });
        overlayText1.forEach(function(element) {
            element.classList.add('overlay-text1-add');
        });
        overlayText2.forEach(function(element) {
            element.classList.add('overlay-text2-add');
        });
        header2Section.classList.add('cid-u2HsKV7TDJ-add');
        contactSection.classList.add('cid-u2HsKV88ir-add');
        feature2Section.classList.add('cid-u2HsKV7LQr-add');
        feature3Section.classList.add('cid-u2HsKV7prD-add');
        formInput.forEach(function(element) {
            element.classList.add('form-input-add');
        });

        nightModeToggle.checked = true;
    }
    // Add event listener to toggle night mode
    nightModeToggle.addEventListener('change', function() {
        toggleNightMode();
    });

});

// function to trigger between day/night mode
function toggleNightMode() {
    const body = document.body;
    const navbarNightMode = document.querySelector('.navbar-night-mode');
    const headerNightMode = document.querySelectorAll('.header-night-mode');
    const btnWhiteOutline = document.querySelector('.btn-white-outline');
    const articleSection = document.querySelector('.cid-u2HsKV6qvx');
    const cardWrapper = document.querySelectorAll('.card-wrapper');
    const worldBankLink = document.querySelector('.world-bank-link');
    const featureNightMode = document.querySelectorAll('.feature-night-mode');
    const featureSection = document.querySelector('.cid-u2HsKV6ukM');
    const btnPrimary = document.querySelectorAll('.btn-primary');
    const formSelect = document.querySelectorAll('.form-select');
    const overlayTitle = document.querySelectorAll('.overlay-title');
    const overlayText1 = document.querySelectorAll('.overlay-text1');
    const overlayText2 = document.querySelectorAll('.overlay-text2');
    const header2Section = document.querySelector('.cid-u2HsKV7TDJ');
    const contactSection = document.querySelector('.cid-u2HsKV88ir');
    const feature2Section = document.querySelector('.cid-u2HsKV7LQr');
    const feature3Section = document.querySelector('.cid-u2HsKV7prD');
    const formInput = document.querySelectorAll('.form-input');

    body.classList.toggle('night-mode');
    navbarNightMode.classList.toggle('navbar-night-mode-add');
    btnWhiteOutline.classList.toggle('btn-white-outline-add');
    headerNightMode.forEach(function(element) {
        element.classList.toggle('header-night-mode-add');
    });
    articleSection.classList.toggle('cid-u2HsKV6qvx-add');
    cardWrapper.forEach(function(element) {
        element.classList.toggle('card-wrapper-add');
    });
    worldBankLink.classList.toggle('world-bank-link-add');
    featureNightMode.forEach(function(element) {
        element.classList.toggle('feature-night-mode-add');
    });
    featureSection.classList.toggle('cid-u2HsKV6ukM-add');
    btnPrimary.forEach(function(element) {
        element.classList.toggle('btn-primary-add');
    });
    formSelect.forEach(function(element) {
        element.classList.toggle('form-select-add');
    });
    overlayTitle.forEach(function(element) {
        element.classList.toggle('overlay-title-add');
    });
    overlayText1.forEach(function(element) {
        element.classList.toggle('overlay-text1-add');
    });
    overlayText2.forEach(function(element) {
        element.classList.toggle('overlay-text2-add');
    });
    header2Section.classList.toggle('cid-u2HsKV7TDJ-add');
    contactSection.classList.toggle('cid-u2HsKV88ir-add');
    feature2Section.classList.toggle('cid-u2HsKV7LQr-add');
    feature3Section.classList.toggle('cid-u2HsKV7prD-add');
    formInput.forEach(function(element) {
        element.classList.toggle('form-input-add');
    });

    // Store the night mode preference
    const isNightMode = body.classList.contains('night-mode');
    localStorage.setItem('nightMode', isNightMode);
}

// Function to create an option element
const createOption = (text) => {
    const option = document.createElement("option");
    option.value = text;
    option.text = text;
    return option;
};

// Populating Year dropdown from 1970 to current year
function populateYearDropdown(latestYear) {
    const yearSelect = document.getElementById("yearSelect");
    const currentYear = new Date().getFullYear();

    document.getElementById("copyright-year").innerHTML = currentYear;

    for (let year = currentYear; year >= 1970; year--) {
        const option = createOption((year == currentYear ? year + " (current)" : year));
        if (year == latestYear) {
            option.selected = true;
            option.text = year + " (latest)";
        }
        yearSelect.appendChild(option);
    }
}

// Function to format AI response
function formatAIResponse(text) {
    return text
        // Convert markdown-style bullets to list
        .replace(/\n\* (.*)/g, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")

        // Convert section headers (standalone lines) to h3
        .replace(
            /\n([A-Z][A-Za-z\s&]+)\n/g,
            "\n<h3>$1</h3>\n"
        )

        // Bold **text**
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        // Paragraphs
        .replace(/\n\n+/g, "</p><p>")
        .trim()
        .replace(/^/, "<p>")
        .replace(/$/, "</p>");
}

// Function to highlight country name in AI response
function highlightCountry(text, country) {
    const regex = new RegExp(`\\b(${country})\\b`, "gi");
    return text.replace(regex, "<strong>$1</strong>");
}

// Function to handle button click for country and year and fetch backend data
function handleButtonClick(selectedCountry, selectedYear) {
    selectedYear = selectedYear.length > 4 ? selectedYear.slice(0, 4) : selectedYear;

    for (let i = 0; i < 8; i++) {
        document.getElementById(`${attributeName[i]}-data`).innerHTML = '';
        document.getElementById(`${attributeName[i]}-data2`).innerHTML = '';

        const imgElement = document.getElementById(`${attributeName[i]}-img`);

        if (imgElement) {
            imgElement.style.opacity = "0.5";

            const loader = document.createElement('div');
            loader.id = `loader-${attributeName[i]}`;
            loader.className = 'loader-spinner';

            imgElement.parentElement.appendChild(loader);
        }
    }

    const getDataPromise = getData(selectedCountry, selectedYear);

    const countryInfo = getCountryInfo(selectedCountry);
    const countryName = countryInfo.name;

    const runFunctionPromise = new Promise((resolve, reject) => {
        fetch('/trigger-run-function', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ countryName })
        })
        .then(response => response.json())
        .then(aiData => {
            resolve(aiData);
        })
        .catch(error => {
            reject(error);
        });
    });

    document.getElementById("ai-response").innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div> Fetching Country Data...`;

    Promise.all([getDataPromise, runFunctionPromise])
        .then(([data, aiData]) => {
            if (aiData && aiData.error) {
                throw new Error(aiData.error);
            }
            
            const aiResponseEl = document.getElementById("ai-response");

            aiResponseEl.classList.remove("fade-in");
            aiResponseEl.classList.add("fade-out");
            
            setTimeout(() => {
                aiResponseEl.innerHTML = formatAIResponse(aiData);
                aiResponseEl.classList.remove("fade-out");
                aiResponseEl.classList.add("fade-in");
            }, 150);

        })
        .catch(error => {
            console.error("An error occurred:", error);
            document.getElementById("ai-response").innerHTML = "Error fetching data for " + countryName + ". Please try again!";
        });

    document.getElementById("ai-know-more").innerHTML = `Want to know more about ${countryName}? Check out the chatbot below!`;

    currentChatCountry = countryName;
    chatHistory = [];
    
    document.getElementById("chat-messages").innerHTML = `
      <div class="chat-message chat-ai">
        Ask me anything about <strong>${countryName}</strong>.
      </div>
    `;
}

// Function to handle country selection for chatbot
function onCountrySelect(countryName) {
  currentChatCountry = countryName;

  chatHistory = [
    {
      role: "system",
      content: `You are an expert assistant answering questions only about ${countryName}. 
      Always stay focused on ${countryName}.`
    }
  ];
}

// Function to reset country selection
function onCountryChange(newCountry) {
  currentChatCountry = newCountry;
  chatHistory = [];
  clearChatUI();
}

// Function to render chat messages in the chatbot window
function renderChatMessage(role, text) {
    const container = document.getElementById("chat-messages");
    const div = document.createElement("div");

    div.className = `chat-message ${role === "user" ? "chat-user" : "chat-ai"}`;
    div.innerHTML = text;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Function to append chat bubble to chat container
function appendChatBubble(role, text) {
  const chatContainer = document.getElementById("chat-messages");

  const bubble = document.createElement("div");
  bubble.className = role === "user" ? "chat-bubble user" : "chat-bubble assistant";

  bubble.innerHTML = text;

  chatContainer.appendChild(bubble);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to build the prompt for the AI chatbot based on chat history and current country
function buildChatPrompt(userMessage) {
    const history = chatHistory
        .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");

    return `
    You are a friendly, knowledgeable geography chatbot.
    
    Current selected country: ${currentChatCountry}
    
    Conversation so far:
    ${history}
    
    User: ${userMessage}
    Assistant:
    `;
}

// Function to send chat message to the backend and get AI response
async function sendChatMessage() {
  const userInput = chatInput.value.trim();
  if (!userInput) return;

  chatInput.value = "";

  appendChatBubble("user", userInput);

  showChatLoader();

  const chatMessages = document.getElementById('chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("/chat-function", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: currentChatCountry,
        chatHistory,
        message: userInput
      })
    });

    const aiReply = await response.json();

    if (aiReply == '' || aiReply == null || typeof aiReply == 'object') {
        appendChatBubble("assistant", chatbotErrorMsg);
    } else {
        appendChatBubble("assistant", aiReply);

        chatHistory.push({ role: "user", content: userInput });
        chatHistory.push({ role: "assistant", content: aiReply });
    }

    removeChatLoader();

    renderChatSuggestions();

  } catch (err) {
    console.error(err);
    removeChatLoader();
    appendChatBubble("assistant", "Something went wrong. Please try again!");
  }
}

// Function to render chatbot suggestions
function renderChatSuggestions() {
  if (!suggestionsContainer) return;

  suggestionsContainer.innerHTML = "";

  chipSuggestions.forEach(text => {
    const chip = document.createElement("div");
    chip.className = "chat-chip";
    chip.textContent = text;

    chip.addEventListener("click", () => {
      sendChipMessage(text);
    });

    suggestionsContainer.appendChild(chip);
  });
}

// Function to send suggestion message to backend
async function sendChipMessage(text) {
  if (!text) return;

  appendChatBubble("user", text);
  showChatLoader();

  try {
    const response = await fetch("/chat-function", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: currentChatCountry,
        chatHistory,
        message: text
      })
    });

    const aiReply = await response.json();

    if (aiReply == '' || aiReply == null || typeof aiReply == 'object') {
        appendChatBubble("assistant", chatbotErrorMsg);
    } else {
        appendChatBubble("assistant", aiReply);

        chatHistory.push({ role: "user", content: text });
        chatHistory.push({ role: "assistant", content: aiReply });
    }

    removeChatLoader();

    renderChatSuggestions();

  } catch (err) {
    console.error(err);
    removeChatLoader();
    appendChatBubble("assistant", "Something went wrong. Please try again!");
  }
}

// Function to show loader in chat
function showChatLoader() {
    const chatMessages = document.getElementById('chat-messages');
    
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'chat-typing-indicator';
    loaderDiv.className = 'typing-loader chat-bubble assistant';
    loaderDiv.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;
    
    chatMessages.appendChild(loaderDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide loader in chat
function removeChatLoader() {
    const loader = document.getElementById('chat-typing-indicator');
    if (loader) {
        loader.remove();
    }
}

// Handler Function to send email
function handleSendEmailButtonClick(event) {
    event.preventDefault();

    const name = document.getElementById('name-form02-0').value;
    const email = document.getElementById('email-form02-0').value;
    const message = document.getElementById('textarea-form02-0').value;

    // Check if any of the inputs are empty
    if (name === '' || email === '' || message === '') {
        alert('Please fill in all fields.');
        return;
    }

    sendEmailButton.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';

    handleSendEmailClick(name, email, message);

    document.getElementById('name-form02-0').value = "";
    document.getElementById('email-form02-0').value = "";
    document.getElementById('textarea-form02-0').value = "";
}

// Function to handle button click for sending email
async function handleSendEmailClick(name, email, message) {
    try {
        const data = { name, email, message };

        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('Email sent successfully');
        } else {
            alert(result.message || 'Mail cannot be sent right now, please try later!');
        }
        sendEmailButton.innerHTML = 'Send';
    } catch (error) {
        alert('Mail cannot be sent right now, please try later!');
        sendEmailButton.innerHTML = 'Send';
    }
}

// Function to extract country code and name
function getCountryInfo(selectedCountry) {
    const countryInfoPattern = /^(.*?) \((.*?)\)/;
    const match = countryInfoPattern.exec(selectedCountry);
    return match ? { name: match[1], code: match[2] } : null;
}

// Function to fetch country flag
async function getCountryFlag(countryName, container) {
    try {
        // Fetch country codes from flagcdn
        const response = await fetch('https://flagcdn.com/en/codes.json');
        if (!response.ok) {
            throw new Error('Unable to fetch country codes from flagcdn.');
        }
        const data = await response.json();

        let countryCode = "";
        let found = false;
        for (const code in data) {
            if (data[code].toLowerCase() === countryName.toLowerCase()) {
                countryCode = code;
                found = true;
                break;
            }
        }
        if (!found) {
            // Clear the country flag span if country code is not found
            container.innerHTML = '';
            throw new Error('Country code from flagcdn not found');
        }

        const apiUrl = `https://flagcdn.com/48x36/${countryCode}.png`;

        // Fetch the flag image using country code
        const flagResponse = await fetch(apiUrl);
        if (!flagResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await flagResponse.blob();

        // Create an image element for the flag
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.style.display = "flex";
        img.style.width = "auto";
        img.style.setProperty('border-radius', '0%', 'important');

        // Clear the container's content and append the new image
        container.innerHTML = ''; // Clear existing content
        container.appendChild(img);

    } catch (error) {
        // Clear the container in case of error
        console.error('Error fetching flagcdn country code:', error);
        container.innerHTML = ''; // Clear existing content
    
        // Create a Bootstrap loader
        const loader = document.createElement('div');
        loader.classList.add('spinner-border', 'text-primary');
        loader.setAttribute('role', 'status');
    
        // Append the loader to the container
        container.appendChild(loader);
    
        // Create an image element for the flag
        const img = document.createElement('img');
        img.src = "https://vectorflags.s3.amazonaws.com/flags/org-earth-wave-01.png";
        img.style.display = "flex";
        img.style.height = "40px";
        img.style.width = "48px";
        img.style.setProperty('border-radius', '0%', 'important');
    
        // Add an event listener to remove the loader once the image is loaded
        img.onload = function() {
            // Remove the loader from the container
            container.removeChild(loader);
        };
    
        // Add an event listener to handle image loading errors
        img.onerror = function() {
            // Remove the loader from the container
            container.removeChild(loader);
        };
    
        container.appendChild(img);
    }
}

// Function to format card data in readable format
function formatNumberdata(number) {
    if (number < 1000) {
        if (!Number.isInteger(number)) {
            return number.toFixed(2);
        }
        return number;
    }
    if (number < 1000000) {
        return (number / 1000).toFixed(2) + 'k+';
    }
    if (number < 1000000000) {
        return (number / 1000000).toFixed(2) + 'M+';
    }
    if (number < 1000000000000) {
        return (number / 1000000000).toFixed(2) + 'B+';
    }
    return (number / 1000000000000).toFixed(2) + 'T+';
}

// Set current country name and flag
async function setCountryNameAndFlag(countryName) {
    document.getElementById("country-name").textContent = countryName;
    const countryFlagContainer = document.getElementById('country-flag-container');
    countryFlagContainer.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
    await getCountryFlag(countryName, countryFlagContainer);
}

// Function to get data for a country for the selected year
async function getData(selectedCountry, selectedYear) {
    const countryInfo = getCountryInfo(selectedCountry);
    const countryCode = countryInfo.code;
    const countryName = countryInfo.name;

    setCountryNameAndFlag(countryName);

    const data1 = new Array(8);
    const data2 = new Array(8);

    const fetchPromises = endpoint.map((indicator, i) => {
        const dataUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?date=${selectedYear}&format=json`;

        return fetch(dataUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data?.[1]?.[0]?.value != null) {
                    const rawValue = data[1][0].value;
                    const formattedValue = formatNumberdata(rawValue);

                    data1[i] = rawValue;

                    if (attributeName[i] === "inflation" || attributeName[i] === "debt-to-gdp") {
                        data2[i] = `(${formattedValue}%)`;
                    } else if (attributeName[i] !== "population") {
                        data2[i] = `($${formattedValue})`;
                    } else {
                        data2[i] = `(${formattedValue})`;
                    }
                } else {
                    data1[i] = "N/A";
                    data2[i] = "N/A";
                }
            })
            .catch(err => {
                console.error(`Error fetching ${indicator}:`, err);
                data1[i] = "N/A";
                data2[i] = "N/A";
            });
    });

    try {
        await Promise.all(fetchPromises);

        for (let i = 0; i < 8; i++) {
            document.getElementById(`${attributeName[i]}-data`).innerHTML = data1[i];
            document.getElementById(`${attributeName[i]}-data2`).innerHTML = data2[i];
            document.getElementById(`${attributeName[i]}-title`).innerHTML = attributeName[i].toUpperCase();
            const loader = document.getElementById(`loader-${attributeName[i]}`);
            if (loader) loader.remove();
        }
    } catch (error) {
        console.error("Error resolving data promises:", error);
    }
}

// Function to increment the card data counter
function incrementCounter(targetElement, endValue, duration) {
    var startTime = null;
    var startValue = parseInt(targetElement.textContent) || 0;
    
    function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var increment = Math.ceil((endValue - startValue) * (progress / duration));

        targetElement.textContent = startValue + increment;

        if (progress < duration) {
            requestAnimationFrame(updateCounter);
        } else {
            targetElement.textContent = endValue;
        }
    }

    requestAnimationFrame(updateCounter);
}
