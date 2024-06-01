import Phaser from 'phaser';

export default class CoinManager {
    private scene: Phaser.Scene;
    private coinText: Phaser.GameObjects.Text | null = null;
    private coins: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    showPopup(): void {
        const popupWidth = 300;
        const popupHeight = 150;
        const popupX = (this.scene.cameras.main.width - popupWidth) / 2;
        const popupY = (this.scene.cameras.main.height - popupHeight) / 2;

        // Create a semi-transparent background
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.5);
        background.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);

        // Create a popup window
        const popup = this.scene.add.graphics();
        popup.fillStyle(0xffffff, 1);
        popup.fillRoundedRect(popupX, popupY, popupWidth, popupHeight, 10);
        popup.lineStyle(2, 0x000000, 1);
        popup.strokeRoundedRect(popupX, popupY, popupWidth, popupHeight, 10);

        // Add text to the popup
        const textStyle = { font: "16px Arial", fill: "#000" };
        const message = this.scene.add.text(popupX + 20, popupY + 20, "그거 아시나요? 와우도는 소가 누운 모양을 닮았다 해서 '와우도'라는 이름이 붙여졌대요.\n\n1000코인 획득!", textStyle);

        // Add 'Confirm' button
        const button = this.scene.add.text(popupX + popupWidth / 2, popupY + popupHeight - 40, "확인", { font: "20px Arial", fill: "#ff0000" })
            .setInteractive()
            .on('pointerdown', () => {
                background.destroy();
                popup.destroy();
                message.destroy();
                button.destroy();
                this.addCoins(1000);
                this.showCoinStatus();
            })
            .setOrigin(0.5);
    }

    showCoinStatus(): void {
        if (this.coinText) {
            this.coinText.destroy();
        }
        this.coinText = this.scene.add.text(this.scene.cameras.main.width - 150, 20, `코인: ${this.coins}`, { font: "20px Arial", fill: "#fff" });
    }

    addCoins(amount: number): void {
        this.coins += amount;
        this.updateCoinStatus();
    }

    updateCoinStatus(): void {
        if (this.coinText) {
            this.coinText.setText(`코인: ${this.coins}`);
        }
    }
}
