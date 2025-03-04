const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.width = 1000;
canvas.height = 560;

const anim_img = new Image();
anim_img.src = 'https://raw.githubusercontent.com/Swillycoder/Tedsindie/main/flower.png'
anim_img.onload = () => {
  console.log("image loaded");
}
//const forest_img = new Image();
//forest_img.src = 'https://raw.githubusercontent.com/Swillycoder/Tedsindie/forest1.png'

class ImageData {
  constructor(src, xOffset, y, width, height, link = null) {
    this.src = src;
    this.xOffset = xOffset;
    this.y = y;
    this.width = width;
    this.height = height;
    this.link = link;
    this.image = new Image();
    this.image.src = src;
    this.loaded = false;

    this.image.onload = () => {
      this.loaded = true;
      this.width = this.width || this.image.width;
      this.height = this.height || this.image.height;
      this.x = canvas.width / 2 - this.width / 2 + this.xOffset;
      
      drawActiveSection();
    };

    this.image.onerror = () => {
      console.error(`Failed to load image: ${this.src}`);
    };
  }

  draw(ctx) {
    if (this.loaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  isHovered(mouseX, mouseY) {
      return (
          mouseX >= this.x &&
          mouseX <= this.x + this.width &&
          mouseY >= this.y &&
          mouseY <= this.y + this.height
      );
  }
}

class MultiLineText {
  constructor({ fileName, x, y, paragraphWidth, font, lineHeight }) {
    this.fileName = fileName; // Path to the .txt file
    this.x = x; // X-coordinate for text placement
    this.y = y; // Y-coordinate for text placement
    this.paragraphWidth = paragraphWidth; // Maximum width for wrapping text
    this.font = font; // Font style (e.g., "16px Arial")
    this.lineHeight = lineHeight; // Line height
    this.text = ""; // Text content to be loaded from file
  }

  async loadText() {
    // Fetch the text from the file
    try {
      const response = await fetch(this.fileName);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${this.fileName}`);
      }
      this.text = await response.text();
    } catch (error) {
      console.error(error.message);
    }
  }

  wrapText(ctx) {
    // Wrap text based on the paragraph width
    const words = this.text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach(word => {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > this.paragraphWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  async draw(ctx) {
    // Load text if not already loaded
    if (!this.text) {
      await this.loadText();
    }

    // Set canvas font
    ctx.font = this.font;
    ctx.textAlign = "left"

    // Wrap and draw text
    const lines = this.wrapText(ctx);
    lines.forEach((line, index) => {
      ctx.fillText(line, this.x, this.y + index * this.lineHeight);
    });
  }
}

class Section {
  constructor(title, content, images = []) {
    this.title = title;
    this.content = content;
    this.images = images;
    this.elements = [];
  }

  addElement(element) {
    this.elements.push(element);
  }

  async draw(ctx) {
    ctx.fillStyle = "rgb(10,26,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // forest_img.onload = () => {
    //   ctx.drawImage(forest_img, 0, 0, canvas.width, canvas.height);

    ctx.font = "30px Courier";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(this.title, canvas.width / 2, 80);

    ctx.font = "20px Courier";
    ctx.textAlign = "center";
    ctx.fillText(this.content, canvas.width / 2, 110);

    for (const image of this.images) {
      image.draw(ctx);
    }

    for (const element of this.elements) {
      await element.draw(ctx);
    }
    // };

    // forest_img.src = 'https://raw.githubusercontent.com/Swillycoder/Tedsindie/forest1.png';
  }

  handleClick(x, y) {
    for (const position of this.imagePositions) {
      if (
        x >= position.x &&
        x <= position.x + position.width &&
        y >= position.y &&
        y <= position.y + position.height &&
        position.link
      ) {
        window.open(position.link, "_blank");
        return;
      }
    }
  }

  static drawBanner(ctx, canvas, sections, activeIndex) {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, 50);

    // Banner titles
    ctx.font = "20px Courier";
    const spacing = canvas.width / sections.length;

    sections.forEach((section, index) => {
      ctx.fillStyle = index === activeIndex ? "white" : "#aaa";
      ctx.textAlign = "center";
      ctx.fillText(section.title, spacing * index + spacing / 2, 30);
    });
  }
}

class Home extends Section {
  constructor() {
    super("Home", "Welcome to Teds Indie Games", [
      new ImageData("./home1.png", 0, 140, 450, 300),
    ]);
    const homeText = new MultiLineText({
      fileName: "./text1.txt",
      x: 10,
      y: 80,
      paragraphWidth:270,
      font: "14px Courier",
      lineHeight: 30,
    });
    this.addElement(homeText);
    }
  

  draw(ctx, canvas) {
    super.draw(ctx, canvas);

    ctx.font = "20px Courier";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText("Enjoy exploring my website!", canvas.width/2, 590);
    ctx.fillText("Use Mouse wheel to navigate", canvas.width/2, 620);
  }
}


class Games extends Section {
  constructor() {
    super("Games", "Explore my games!", [
      new ImageData("./game1.png", -400, 150, 200, 150, "https://swillycoder.github.io/Jungle-Runner/"),
      new ImageData("./game2.png", -150, 150, 200, 150, "https://swillycoder.github.io/Rottentomatos/"),
      new ImageData("./game3.png", 100, 150, 200, 150, "https://swillycoder.github.io/SeahorseWorld/"),
      new ImageData("./game4.png", 400, 150, 200, 150, "https://swillycoder.github.io/Taxidriver/"),
      new ImageData("./game5.png", -400, 360, 200, 150, "https://swillycoder.github.io/Namageddon/"),
      new ImageData("./game6.png", -150, 360, 200, 150, "https://swillycoder.github.io/ticktickboom/"),
      new ImageData("./game7.png", 100, 360, 200, 150, "https://swillycoder.github.io/fruity/"),
      new ImageData("./game8.png", 400, 360, 200, 150, "https://swillycoder.github.io/floattedaway/"),
    ]);
  }

  draw(ctx, canvas) {
    super.draw(ctx, canvas);
    ctx.fillStyle = "white";
    ctx.fillText("JUNGLE RUNNER!", canvas.width/2 - 400, 330);
    ctx.fillText("ROTTEN TOMATOES!", canvas.width/2 -150, 330);
    ctx.fillText("SEAHORSE WORLD!", canvas.width/2 + 150, 330);
    ctx.fillText("NEW YORK TAXI!", canvas.width/2 + 400, 330);
    ctx.fillText("NAMAGEDDON!", canvas.width/2 - 400, 540);
    ctx.fillText("TICK TICK BOOM!", canvas.width/2 - 150, 540);
    ctx.fillText("FRUITY!", canvas.width/2 + 150, 540);
    ctx.fillText("FLOAT TED AWAY!", canvas.width/2 + 400, 540);
    ctx.fillText("Click on an image to PLAY!", canvas.width/2, 600);
  }
}

class Bio extends Section {
  constructor() {
    super("Bio", "Learn more about me!", [
      new ImageData("./bio1.png", 0, 120, 380, 380),
    ]);
    const bioText = new MultiLineText({
      fileName: "./bio.txt",
      x: 20,
      y: 150,
      paragraphWidth:300,
      font: "16px Courier",
      lineHeight: 30,
    });
    this.addElement(bioText);
    }
  

  draw(ctx, canvas) {
    super.draw(ctx, canvas);
    ctx.font = "20px Courier"
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText("I hope you found this interesting!", canvas.width/2, 600);
  }
}

class Contact extends Section {
  constructor() {
    super("Contact", "Get in touch with me!", [
      new ImageData("./contact1.png", 0, 150, 600, 400),
    ]);
  }

  draw(ctx, canvas) {
    super.draw(ctx, canvas);
    ctx.fillStyle = "white";
    ctx.fillText("Email: samperryinbox@gmail.com", canvas.width/2, 600);
  }
}

class Donate extends Section {
  constructor() {
    super("Donate", "Support my work!", [
      new ImageData("./links1.png", -200, 150, 200, 200),
      new ImageData("./metamask.png", 200, 150, 200, 200),

      new ImageData("./arena.png", -450, 150, 100, 100),
      new ImageData("./avax.png", -450, 250, 100, 100),
      new ImageData("./coq.png", -450, 350, 100, 100),
      new ImageData("./nochill.png", -450, 450, 100, 100),

      new ImageData("./polygon.png", 450, 150, 100, 100),
      new ImageData("./arbitrum.png", 450, 250, 100, 100),
      new ImageData("./binance.png", 450, 350, 100, 100),
      new ImageData("./ethereum.png", 450, 450, 100, 100),
      new ImageData("./linea.png", 550, 150, 100, 100),
      new ImageData("./avax.png", 550, 250, 100, 100),
      
    ]);
  }

  draw(ctx, canvas) {
    super.draw(ctx, canvas);
    ctx.fillStyle = "white";
    ctx.fillText("Thank you for your support!", canvas.width/2, 550);
    ctx.fillText("Accepted Tokens in $ARENA", canvas.width/2 -270, 120);
    ctx.fillText("Supported Networks in Metamask", canvas.width/2 + 300, 120);
    ctx.fillStyle = "white";
    ctx.fillText("ARENA App", canvas.width/2 - 200, 380);
    ctx.fillStyle = "white";
    ctx.fillText("METAMASK App", canvas.width/2 + 200, 380);

    //Wallet address 1
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(`0x1A282DA247001dFb57e31F00Fab32E94aC5Ff0f9`, canvas.width/2 - 200, 460);
    //Wallet Address 2
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(`0xee6F5b3A8Ac0cc1a66789E6c3f3D4dBE15839F6A`, canvas.width/2 + 200, 460);

      // Draw "Copy" button 1
    ctx.fillStyle = "#007BFF";
    ctx.fillRect(canvas.width/2 - 250, 400, 100, 30);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Copy", canvas.width/2 -200, 420);
      // Draw "Copy" button 2
    ctx.fillStyle = "#007BFF";
    ctx.fillRect(canvas.width/2 + 150, 400, 100, 30);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Copy", canvas.width/2 + 200, 420);
    }
  
  handleClick(x, y) {
  
    // Check if "Copy" button is clicked
    if (x >= canvas.width/2 -250 && x <= canvas.width/2 -150 && y >=400 && y <= 430) {
      navigator.clipboard.writeText("0x1A282DA247001dFb57e31F00Fab32E94aC5Ff0f9").then(() => {
        alert("Wallet address copied to clipboard!");
      }).catch(err => {
        alert("Failed to copy wallet address. Please try again.");
      });
    }
    if (x >= canvas.width/2 +150 && x <= canvas.width/2 +250 && y >=400 && y <= 430) {
      navigator.clipboard.writeText("0xee6F5b3A8Ac0cc1a66789E6c3f3D4dBE15839F6A").then(() => {
        alert("Wallet address copied to clipboard!");
      }).catch(err => {
        alert("Failed to copy wallet address. Please try again.");
      });
    }
  }
}

class Leaf {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.frameDelay = 100; 
    this.frameTimer = 0;
    this.frames = 0;
    this.width = 150;
    this.height = 150;
  }

  draw(ctx) {
  drawImage(anim_img, this.x, this.y);
  }

  update () {
  this.y += 0.1;
  }
/*
  update() {
    this.y += 0.1;

    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
      this.frames++;
      this.frameTimer = 0;
    }
    if (this.frames >= 7) {
      this.frames = 0;
    }

    if (this.y > window.innerHeight) {
      this.y = 0;
    }
  }

  draw(ctx) {
    if (anim_img.complete && anim_img.naturalHeight !== 0) {
      ctx.drawImage(
        anim_img,
        this.frames * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
}
*/
async function renderSections(ctx, canvas) {
  for (const section of sections) {
    section.draw(ctx, canvas); // Draw each section
  }
}

function preloadImages(imageDataArray) {
  const promises = [];
  for (const imageData of imageDataArray) {
      promises.push(
          new Promise((resolve, reject) => {
              const img = new Image();
              img.src = imageData.src;
              img.onload = () => resolve();
              img.onerror = () => reject(`Failed to load image: ${imageData.src}`);
          })
      );
  }
  return Promise.all(promises);
}

const sections = [
    new Home(),
    new Games(),
    new Bio(),
    new Contact(),
    new Donate(),
  ];

// Collect all images from sections
const allImages = sections.flatMap(section => section.images);

// Preload the images
preloadImages(allImages)
  .then(() => {
      console.log("All images loaded successfully.");
      drawActiveSection();
  })
  .catch(error => {
      console.error(error);
  });

let activeSectionIndex = 0;
const leaves = []  

function initializeLeaves() {
  for (let i = 0; i < 10; i++) {
    const leafX = Math.random() * window.innerWidth;
    const leafY = Math.random() * window.innerHeight;
    leaves.push(new Leaf(leafX, leafY));
  }
}
  
function drawActiveSection() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    sections[activeSectionIndex].draw(ctx, canvas);

    leaves.forEach(leaf => {
      leaf.update();
      leaf.draw(ctx);
    });

    Section.drawBanner(ctx, canvas, sections, activeSectionIndex);

    requestAnimationFrame(drawActiveSection);

}

drawActiveSection();
initializeLeaves();
renderSections(ctx, canvas);

window.onload = () => {
  drawActiveSection();
};

window.addEventListener('load', () => {
  drawActiveSection();
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  let isHovering = false

  sections[activeSectionIndex].images.forEach((imageData) => {
      if (imageData.isHovered(mouseX, mouseY)) {
        isHovering = true
      }
  });
  canvas.style.cursor = isHovering ? "pointer" : "default";
});

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

  sections[activeSectionIndex].images.forEach((imageData) => {
    if (imageData.isHovered(mouseX, mouseY) && imageData.link) {
      window.open(imageData.link, "_blank");
      }
  });
  sections[activeSectionIndex].handleClick(mouseX, mouseY);
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawActiveSection();
});

window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0 && activeSectionIndex < sections.length - 1) {
      activeSectionIndex++;
    } else if (e.deltaY < 0 && activeSectionIndex > 0) {
      activeSectionIndex--;
    }
    
    drawActiveSection();
});
