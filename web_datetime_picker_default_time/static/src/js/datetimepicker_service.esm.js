import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { datetimePickerService } from "@web/core/datetime/datetimepicker_service";

patch(datetimePickerService, {
    start(env, { popover: popoverService }) {
        const superReturn = super.start(env, { popover: popoverService });

        return {
            ...superReturn,
            create(hookParams, getInputs = () => [hookParams.target, null]) {
                const datetimepickerDefaultValueService = useService("datetimepicker_defaultValue");

                const additionalPickerProps = datetimepickerDefaultValueService.get();

                const updatedHookParams = Object.create(hookParams);
                Object.defineProperty(updatedHookParams, "pickerProps", {
                    get() {
                        return {
                            ...hookParams.pickerProps,
                            ...additionalPickerProps,
                        };
                    },
                });

                return superReturn.create(updatedHookParams, getInputs);
            }
        };
    },
});

