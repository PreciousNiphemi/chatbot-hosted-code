document.addEventListener("DOMContentLoaded", function () {
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
      '<ion-icon name="chatbubble-ellipses-outline" class="icon-size"></ion-icon>';
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
        '{"placeholder":{"text": "Welcome to the demo!"}}'
      );
      elementRef.setAttribute(
        "style",
        "background-color: #f7f7f7; border-radius: 8px"
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
          url: "http://localhost:5000/ask",
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          text: "Hello... How can I help you today?",
        })
      );

      // Add event listener to floating chat icon
      floatingChatIcon.addEventListener("click", toggleChat);
    };
  };
});
