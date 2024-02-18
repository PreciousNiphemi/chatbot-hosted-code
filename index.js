document.addEventListener("DOMContentLoaded", function () {
  // Define intro texts
  const introTexts = {
    gp: `<p>Welcome to the General Partnership chatbot!<br/>You can ask me questions about what we do, our team members and more.<br/>To start just send a message below!</p>`,
    pinnacle: `<p>Welcome to the Pinnacle Vet chatbot!<br/>You can ask me questions about the services we offer, our hours, book an appointment, and more.<br/>To start just send a message below!</p>`,
    hillside: `<p>Welcome to the Hillside Vet chatbot!<br/>You can ask me questions about the services we offer, our hours, book an appointment, and more.<br/> To start just send a message below!</p>`,
    happy: `<p>Welcome to the Happy Pet Vet chatbot!<br/>You can ask me questions about the services we offer, our hours, book an appointment, and more.<br/>To start just send a message below!</p>`,
    handyman: `<p>Welcome to the Handyman Connection chatbot!<br/>You can ask me questions about the services we offer, our hours, book an appointment, and more.<br/>To start just send a message below!</p>`,
  };

  // Check query params for company_id and save it in cookies
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get("company_id");
  if (companyId) {
    console.log("THE COMPANY ID:", companyId);
    document.cookie = `company_id=${companyId}; path=/`;
  }

  // Get company_id from cookies
  const cookies = document.cookie.split("; ");
  console.log("COOKIES", cookies);
  const companyCookie = cookies.find((row) => row.startsWith("company_id="));
  const savedCompanyId = companyCookie ? companyCookie.split("=")[1] : null;

  // Log the company_id cookie
  console.log("company_id cookie:", savedCompanyId);

  // Inject styles for floating chat icon
  const style = document.createElement("style");
  style.innerHTML = `
        /* Styles for floating chat icon */
        .floating-chat-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            z-index: 1000;
        }

        .icon-size {
            height: 80px;
            width: 60px;
        }

       

        /* Styles for deep-chat-container */
        .deep-chat-container {
            display: none; /* Initially hide deep-chat */
            position: fixed;
            bottom: 120px;
            right: 20px;
            z-index: 1001; /* Ensure deep-chat is on top of floating chat icon */
            background-color: #f7f7f7;
            border-radius: 8px;
        }

       
    `;
  document.head.appendChild(style);

  // Load CDN script for floating chat icon
  const ioniconsScript = document.createElement("script");
  ioniconsScript.src = "https://unpkg.com/ionicons@5.0.0/dist/ionicons.js";
  document.body.appendChild(ioniconsScript);

  // Create floating chat icon
  ioniconsScript.onload = function () {
    const floatingChatIcon = document.createElement("div");
    floatingChatIcon.classList.add("floating-chat-icon");
    floatingChatIcon.innerHTML =
      '<img src="images/chat-icon.svg" width="50" height="50">';
    document.body.appendChild(floatingChatIcon);

    // Define the toggleChat function
    function toggleChat() {
      const deepChatContainer = document.getElementById("deep-chat-container");
      deepChatContainer.style.display =
        deepChatContainer.style.display === "none" ? "block" : "none";
    }

    // Create deep-chat-container
    const deepChatContainer = document.createElement("div");
    deepChatContainer.id = "deep-chat-container";
    deepChatContainer.classList.add("deep-chat-container");
    document.body.appendChild(deepChatContainer);

    // Load deep-chat script
    const deepChatScript = document.createElement("script");
    deepChatScript.type = "module";
    deepChatScript.src =
      "https://unpkg.com/deep-chat@1.4.10/dist/deepChat.bundle.js";
    document.body.appendChild(deepChatScript);

    // Set initial messages and intro message
    deepChatScript.onload = function () {
      const elementRef = document.createElement("deep-chat");
      elementRef.setAttribute("id", "chat-element");
      elementRef.setAttribute("demo", "true");
      elementRef.setAttribute(
        "textInput",
        '{"placeholder":{"text": "Welcome!"}}'
      );
      elementRef.setAttribute(
        "style",
        "background-color: #f7f7f7; border-radius: 8px"
      );

      elementRef.setAttribute(
        "messageStyles",
        `
      {
        "default": {
          "intro": {
            "bubble": {"backgroundColor": "#EDEDED", "color": "#333333", "borderRadius":"0px", "borderBottomLeftRadius": "16px", "borderBottomRightRadius": "16px","borderTopRightRadius": "16px", "whiteSpace": "pre-wrap", "letterSpacing":"3rem"}
          },
          "user": {
            "bubble": {
              "background": "#0070CC",
              "color":"#FFFFFF",
              "borderRadius":"0px",
              "borderTopLeftRadius": "16px",
              "borderBottomLeftRadius": "16px",
              "borderBottomRightRadius": "16px"
            }
          },
          "ai": {"bubble": {"backgroundColor": "#EDEDED", "color": "#333333", "borderRadius":"0px", "borderBottomLeftRadius": "16px", "borderBottomRightRadius": "16px","borderTopRightRadius": "16px"}}
  

        }
      }
      `
      );

      elementRef.setAttribute(
        "submitButtonStyles",
        `{
              "submit": {
                "container": {
                  "default": {"backgroundColor": "#e3f0ff"},
                  "hover": {"backgroundColor": "#c6e1ff"},
                  "click": {"backgroundColor": "#acd3ff"}
                },
                "svg": {
                  "styles": {
                    "default": {
                      "filter":
                        "brightness(0) saturate(100%) invert(58%) sepia(53%) saturate(6828%) hue-rotate(214deg) brightness(100%) contrast(100%)"
                    }
                  }
                }
              },
              "alwaysEnabled": true,
              "position": "outside-right"
            }`
      );
      deepChatContainer.appendChild(elementRef);

      // elementRef.initialMessages = [
      //   { role: "user", text: "Hey, how are you today?" },
      //   { role: "ai", text: "I am doing very well!" },
      // ];

      elementRef.setAttribute(
        "request",
        JSON.stringify({
          url: "https://chatbot-backend-dfii.onrender.com/ask",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          additionalBodyProps: { company_id: savedCompanyId },
        })
      );

      elementRef.setAttribute(
        "requestBodyLimits",
        JSON.stringify({
          maxMessages: 0,
        })
      );

      elementRef.setAttribute(
        "introMessage",
        JSON.stringify({
          html: introTexts[savedCompanyId],
        })
      );

      // Add event listener to floating chat icon
      floatingChatIcon.addEventListener("click", toggleChat);
    };
  };
});
