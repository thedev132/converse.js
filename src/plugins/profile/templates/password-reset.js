import { __ } from 'i18n';
import { modal_close_button } from "plugins/modal/templates/buttons.js";
import { html } from 'lit';


export default (el) => {
    const i18n_submit = __('Submit');
    const i18n_are_you_sure = __('Are you sure?');
    const i18n_sure = __("I'm sure");
    const i18n_passwords_must_match = __('The two passwords entered must match');

    return html` <form class="converse-form passwordreset-form" @submit=${ev => el.onSubmit(ev)}>
        <fieldset class="form-group">
            <label for="converse_passwordreset_password">Password</label>
            <input
                class="form-control"
                type="password"
                value=""
                name="password"
                required="required"
                id="converse_passwordreset_password"
            />
            <label for="converse_passwordreset_password_check">Re-type Password</label>
            <input
                class="form-control"
                type="password"
                value=""
                name="password_check"
                @input=${ev => el.checkPasswordsMatch(ev)}
                required="required"
                id="converse_passwordreset_password_check"
            />
            ${el.passwords_mismatched ? html`<span class="error">${i18n_passwords_must_match}</span>` : ''}
        </fieldset>
        ${ el.confirmation_active ? html`<span>${i18n_are_you_sure}</span>` : '' }
        ${ modal_close_button }
        <input
            class="save-form btn btn-primary"
            type="submit"
            value=${ this.confirmation_active ? i18n_sure : i18n_submit }
        />
    </form>`;
}
