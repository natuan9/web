/* Copyright 2024 Camptocamp
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl) */
import {DateTimePicker} from "@web/core/datetime/datetime_picker";
import {DateTimePickerPopover} from "@web/core/datetime/datetime_picker_popover";
import {MAX_VALID_DATE, MIN_VALID_DATE, clampDate, today} from "@web/core/l10n/dates";
import {ensureArray} from "@web/core/utils/arrays";
import {patch} from "@web/core/utils/patch";
const {DateTime} = luxon;

/**
 * @param {Number} min
 * @param {Number} max
 */
const numberRange = (min, max) => [...Array(max - min)].map((_, i) => i + min);

/**
 * @param {NullableDateTime | "today"} value
 * @param {NullableDateTime | "today"} defaultValue
 */
const parseLimitDate = (value, defaultValue) =>
    clampDate(
        value === "today" ? today() : value || defaultValue,
        MIN_VALID_DATE,
        MAX_VALID_DATE
    );

// Time constants
const HOURS = numberRange(0, 24).map((hour) => [hour, String(hour)]);
const MINUTES = numberRange(0, 60).map((minute) => [
    minute,
    String(minute || 0).padStart(2, "0"),
]);
const SECONDS = [...MINUTES];

patch(DateTimePicker.prototype, {
    /**
     * @param {DateTimePickerProps} props
     */
    onPropsUpdated(props) {
        // Original logic handles
        /** @type {[NullableDateTime] | NullableDateRange} */
        this.values = ensureArray(props.value).map((value) =>
            value && !value.isValid ? null : value
        );
        this.availableHours = HOURS;
        this.availableMinutes = MINUTES.filter(
            (minute) => !(minute[0] % props.rounding)
        );
        this.availableSeconds = props.rounding ? [] : SECONDS;
        this.allowedPrecisionLevels = this.filterPrecisionLevels(
            props.minPrecision,
            props.maxPrecision
        );

        this.additionalMonth = props.range && !this.env.isSmall;
        this.maxDate = parseLimitDate(props.maxDate, MAX_VALID_DATE);
        this.minDate = parseLimitDate(props.minDate, MIN_VALID_DATE);
        if (this.props.type === "date") {
            this.maxDate = this.maxDate.endOf("day");
            this.minDate = this.minDate.startOf("day");
        }

        if (this.maxDate < this.minDate) {
            throw new Error(
                `DateTimePicker error: given "maxDate" comes before "minDate".`
            );
        }

        // OVERRIDE: Add defaultTime
        const timeValues = this.values.map((val, index) =>
            this.getCustomTimeValues(val, index)
        );
        if (props.range) {
            this.state.timeValues = timeValues;
        } else {
            this.state.timeValues = [];
            this.state.timeValues[props.focusedDateIndex] =
                timeValues[props.focusedDateIndex];
        }

        this.shouldAdjustFocusDate = !props.range;
        this.adjustFocus(this.values, props.focusedDateIndex);
        this.handle12HourSystem();
        this.state.timeValues = this.state.timeValues.map((timeValue) =>
            timeValue.map(String)
        );
    },

    getCustomTimeValues(val, index) {
        let timeValues = [];
        if (index === 1) {
            timeValues = [
                val?.hour ||
                    this.props.defaultEndTime?.hour ||
                    DateTime.local().hour + 1,
                (val || this.props.defaultEndTime)?.minute || 0,
                (val || this.props.defaultEndTime)?.second || 0,
            ];
        } else {
            timeValues = [
                (
                    val ||
                    this.props.defaultTime ||
                    this.props.defaultStartTime ||
                    DateTime.local()
                ).hour,
                (val || this.props.defaultTime || this.props.defaultStartTime)
                    ?.minute || 0,
                (val || this.props.defaultTime || this.props.defaultStartTime)
                    ?.second || 0,
            ];
        }

        return timeValues;
    },
});

DateTimePicker.props = {
    ...DateTimePicker.props,
    defaultTime: {
        type: Object,
        shape: {
            hour: Number,
            minute: Number,
            second: Number,
        },
        optional: true,
    },
    defaultStartTime: {
        type: Object,
        shape: {
            hour: Number,
            minute: Number,
            second: Number,
        },
        optional: true,
    },
    defaultEndTime: {
        type: Object,
        shape: {
            hour: Number,
            minute: Number,
            second: Number,
        },
        optional: true,
    },
};

DateTimePickerPopover.props.pickerProps.shape = DateTimePicker.props;
