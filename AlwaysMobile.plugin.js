/**
 * @name AlwaysMobileIcon
 * @version 1.2.0
 * @description A BetterDiscord plugin that forces only the user running the script to show the mobile icon, while others display their normal status.
 * @author SEI2187
 * @source https://github.com/SEI2187/AlwaysMobileIcon
 * @invite wTz4JbYeTt
 */

module.exports = class AlwaysMobileIcon {
    constructor() {
        this.originalStatus = null;
        this.isActive = false; // Track whether the plugin is active
        this.StatusModule = null;
        this.CurrentUserModule = null;
    }

    getName() {
        return "AlwaysMobileIcon";
    }

    getDescription() {
        return "Forces only the user running the plugin to appear with the mobile icon, keeping others' status normal.";
    }

    getVersion() {
        return "1.2.0";
    }

    getAuthor() {
        return "SEI2187";
    }

    load() {
        BdApi.showToast("AlwaysMobileIcon plugin loaded");
        this.addButton(); // Add the button when the plugin is loaded
    }

    start() {
        this.StatusModule = BdApi.findModuleByProps("getStatus", "isMobileOnline");
        this.CurrentUserModule = BdApi.findModuleByProps("getCurrentUser");
        if (this.StatusModule && this.CurrentUserModule) {
            this.patchUserStatus();
        } else {
            console.error("[AlwaysMobileIcon] Required modules not found.");
        }
    }

    stop() {
        this.unpatchUserStatus();
        BdApi.showToast("AlwaysMobileIcon plugin stopped");
        this.removeButton(); // Remove the button when the plugin is stopped
    }

    addButton() {
        const button = document.createElement("button");
        button.innerText = "Toggle Mobile Status";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.zIndex = "1000";
        button.style.padding = "10px 15px";
        button.style.backgroundColor = "#7289da";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = () => this.toggleStatus();

        document.body.appendChild(button);
        this.button = button; // Store the button reference
    }

    removeButton() {
        if (this.button) {
            document.body.removeChild(this.button);
        }
    }

    toggleStatus() {
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.patchUserStatus();
            this.button.style.backgroundColor = "#36454F";
            BdApi.showToast("Mobile status enabled.");
        } else {
            this.unpatchUserStatus();
            this.button.style.backgroundColor = "#7289da";
            BdApi.showToast("Mobile status disabled.");
        }
    }

    patchUserStatus() {
        if (this.originalStatus) {
            console.warn("[AlwaysMobileIcon] Status patching already applied.");
            return; // Prevent double patching
        }

        // Save the original method for restoring later
        this.originalStatus = this.StatusModule.isMobileOnline;

        // Override the isMobileOnline method to check if it's the current user
        this.StatusModule.isMobileOnline = (userId) => {
            const currentUser = this.CurrentUserModule.getCurrentUser();
            if (userId === currentUser.id && this.isActive) {
                // If it's the current user, return true (mobile status)
                return true;
            }
            // Otherwise, return the normal status
            return this.originalStatus(userId);
        };

        BdApi.showToast("You will now always appear as mobile.");
    }

    unpatchUserStatus() {
        if (!this.originalStatus) {
            console.warn("[AlwaysMobileIcon] No status patching applied, skipping unpatch.");
            return; // Prevent unpatching if it wasn't patched
        }

        // Restore the original isMobileOnline method
        this.StatusModule.isMobileOnline = this.originalStatus;
        this.originalStatus = null; // Reset original status
        BdApi.showToast("Your status will no longer always appear as mobile.");
    }
};
