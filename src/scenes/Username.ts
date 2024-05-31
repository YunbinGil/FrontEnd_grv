import { CHAT } from "@constants/actions";
import { TYPE_USERNAME, TYPE_MAIN } from "@constants/scenes";
import { Scene } from "phaser";

class Username extends Scene {
  private inputElement!: HTMLInputElement;
  private buttonElement!: HTMLButtonElement;
  private formElement!: HTMLElement;

  constructor() {
    super({ key: TYPE_USERNAME, active: true });
    this.formElement = document.getElementById(CHAT)!;
  }

  preload() {
    this.formElement.classList.add("hidden");
  }

  create() {
    const logo = this.add.image(400, 260, "logo");
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
    this.inputElement.className = "styled-input";
    document.body.appendChild(this.inputElement);

    this.buttonElement = document.createElement("button");
    this.buttonElement.textContent = "확인";
    this.buttonElement.className = "styled-button";
    document.body.appendChild(this.buttonElement);

    this.buttonElement.addEventListener("click", () => {
      const username = this.inputElement.value;
      localStorage.setItem("username", username);
      this.formElement.classList.remove("hidden");
      document.body.removeChild(this.inputElement);
      document.body.removeChild(this.buttonElement);
      this.scene.start(TYPE_MAIN);
    });
  }
}

export default Username;
