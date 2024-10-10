/**
 * @name AlwaysMobileIcon
 * @version 1.1.0
 * @description A BetterDiscord plugin that forces only the user running the script to show the mobile icon, while others display their normal status.
 * @author SEI2187
 * @source https://github.com/SEI2187/AlwaysMobileIcon
 * @invite wTz4JbYeTt
 */

module.exports = class AlwaysMobileIcon {
    constructor() {
        this.originalStatus = null;
    }

    getName() {
        return "AlwaysMobileIcon";
    }

    getDescription() {
        return "Forces only the user running the plugin to appear with the mobile icon, keeping others' status normal.";
    }

    getVersion() {
        return "1.1.0";
    }

    getAuthor() {
        return "SEI2187";
    }

    // Called when the plugin is loaded (but not yet started)
    load() {
        BdApi.showToast("AlwaysMobileIcon plugin loaded");
    }

    // Called when the plugin is started
    start() {
        this.patchUserStatus();
    }

    // Called when the plugin is stopped
    stop() {
        this.unpatchUserStatus();
        BdApi.showToast("AlwaysMobileIcon plugin stopped");
    }

    // Function to patch the user's status to always show the mobile icon for the current user
    patchUserStatus() {
        const StatusModule = BdApi.findModuleByProps("getStatus", "isMobileOnline");
        const CurrentUserModule = BdApi.findModuleByProps("getCurrentUser");

        if (!StatusModule || !CurrentUserModule) {
            console.error("[AlwaysMobileIcon] Could not find required modules.");
            return;
        }

        // Save the original method for restoring later
        this.originalStatus = StatusModule.isMobileOnline;

        // Override the isMobileOnline method to check if it's the current user
        StatusModule.isMobileOnline = (userId) => {
            const currentUser = CurrentUserModule.getCurrentUser();
            if (userId === currentUser.id) {
                // If it's the current user, return true (mobile status)
                return true;
            }
            // Otherwise, return the normal status
            return this.originalStatus(userId);
        };

        BdApi.showToast("You will now always appear as mobile.");
    }

    // Function to unpatch (restore) the original status behavior
    unpatchUserStatus() {
        const StatusModule = BdApi.findModuleByProps("getStatus", "isMobileOnline");

        if (StatusModule && this.originalStatus) {
            // Restore the original isMobileOnline method
            StatusModule.isMobileOnline = this.originalStatus;
            BdApi.showToast("Your status will no longer always appear as mobile.");
        }
    }
};
