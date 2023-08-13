import { SocialEnumKeyType } from "../types/auth";

export const authType = {
    getAuthType: function () {
        const authType = localStorage.getItem('authType');
        return authType || '';
    },

    setAuthType: function (authType: SocialEnumKeyType) {
        localStorage.setItem('authType', authType);
    },

    removeAuthType: function () {
        if (this.getAuthType()) {
            localStorage.removeItem('authType');
        }
    },
};
