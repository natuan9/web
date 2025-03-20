/** @odoo-module **/
import {DateTimeField, dateRangeField} from "@web/views/fields/datetime/datetime_field";
import {patch} from "@web/core/utils/patch";
import {onMounted, useRef} from "@odoo/owl";
const {DateTime} = luxon;

patch(DateTimeField.prototype, {
    setup() {
        super.setup();
        this.startDateRef = useRef("start-date");

        onMounted(() => {
            this.startDateRef.el.addEventListener("focus", this.onFocus.bind(this));
        });
    },

    /**
     * @param {PointerEvent} ev
     */
    onFocus({target}) {
        if (this.props.defaultStartDateField === "today" && !this.state.value[0]) {
            this.state.value = [DateTime.now(), false];
        }
    },
});

DateTimeField.props = {
    ...DateTimeField.props,
    defaultStartDateField: {type: String, optional: true},
};

const super_extractProps = dateRangeField.extractProps;
dateRangeField.extractProps = ({attrs, options}, dynamicInfo) => ({
    ...super_extractProps({attrs, options}, dynamicInfo),
    defaultStartDateField: options.default_start_date_field,
});
