import { CustomElement } from 'shared/components/element.js';
import { _converse, api, converse } from '@converse/headless/core';
import tpl_password_reset from './templates/password-reset.js';

const { Strophe, $iq, u } = converse.env;

class PasswordReset extends CustomElement {
    initialize () {
        this.confirmation_active = false;
        this.passwords_mismatched = false;
    }

    render () {
        return tpl_password_reset(this);
    }

    checkPasswordsMatch (ev) {
        const form_data = new FormData(ev.target.form);
        const password = form_data.get('password');
        const password_check = form_data.get('password_check');

        if (password != password_check) {
            this.passwords_mismatched = true;
            this.confirmation_active = false;
        } else {
            this.passwords_mismatched = false;
        }
        this.requestUpdate();
    }

    async onSubmit (ev) {
        ev.preventDefault();

        const password = new FormData(ev.target).get('password');
        const password_check = new FormData(ev.target).get('password_check');

        if (password === password_check) {
            if (this.confirmation_active) {
                await this.postNewInfo(password);
                this.confirmation_active = false;
            } else {
                this.confirmation_active = true;
            }
        } else {
            this.passwords_mismatched = true;
            this.confirmation_active = false;
        }
        this.requestUpdate();
    }

    async postNewInfo (password) { // eslint-disable-line class-methods-use-this
        const domain = Strophe.getDomainFromJid(_converse.bare_jid);
        const iq = $iq({ 'type': 'get', 'to': domain }).c('query', { 'xmlns': 'jabber:iq:register' });
        const response = await _converse.api.sendIQ(iq);
        const username = response.querySelector('username').innerHTML;

        const resetiq = $iq({ 'type': 'set', 'to': domain })
            .c('query', { 'xmlns': 'jabber:iq:register' })
            .c('username', {}, username)
            .c('password', {}, password);

        const iq_result = await _converse.api.sendIQ(resetiq);
        if (iq_result === null) {
            api.alert('info', 'Password reset failed.', ['Timeout on password reset. Check your connection?']);
        } else if (u.isErrorStanza(iq_result)) {
            api.alert('info', 'Permission Denied.', [
                'Either your former password was incorrect, or you may not change your password.',
            ]);
        } else {
            api.alert('info', 'Password reset.', ['Your password has been reset.']);
        }
    }
}

api.elements.define('converse-change-password-form', PasswordReset);
