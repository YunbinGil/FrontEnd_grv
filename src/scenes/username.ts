import { CHAT } from "@constants/actions";
import { USERNAME, TYPE_MAIN } from "@constants/scenes";
import { Scene } from "phaser";

class Username extends Scene {
  private inputElement!: HTMLInputElement;
  private buttonElement!: HTMLButtonElement;
  private formElement!: HTMLElement;

  constructor() {
    super({ key: USERNAME, active: true });
    this.formElement = document.getElementById(CHAT)!;
  }

  preload() {
    this.load.image("logo", "logo.png");
    this.formElement.classList.add("hidden");
  }

  create() {
    const logo = this.add.image(400, 300, "logo");
    logo.setScale(0.5);
    if (this.inputElement) {
      this.inputElement.remove();
    }
    if (this.buttonElement) {
      this.buttonElement.remove();
    }

    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.placeholder = "Enter your name";
    this.inputElement.style.position = "absolute";
    this.inputElement.style.top = "55%";
    this.inputElement.style.left = "50%";
    this.inputElement.style.transform = "translate(-50%, -50%)";
    this.inputElement.style.zIndex = "1";
    document.body.appendChild(this.inputElement);

    this.buttonElement = document.createElement("button");
    this.buttonElement.textContent = "확인";
    this.buttonElement.style.position = "absolute";
    this.buttonElement.style.top = "65%";
    this.buttonElement.style.left = "50%";
    this.buttonElement.style.transform = "translate(-50%, -50%)";
    this.buttonElement.style.zIndex = "1";
    this.buttonElement.style.padding = "10px 20px";
    this.buttonElement.style.borderRadius = "10px";
    document.body.appendChild(this.buttonElement);

    this.buttonElement.addEventListener("click", () => {
      const username = this.inputElement.value;
      localStorage.setItem("username", username);
      this.inputElement.classList.add("hidden");
      this.buttonElement.classList.add("hidden");
      this.formElement.classList.remove("hidden");
      this.scene.start(TYPE_MAIN);
    });
  }
}

export default Username;
