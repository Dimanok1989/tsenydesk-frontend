import { Form } from "semantic-ui-react";
import moment from "moment";
import { FieldProps } from "@/stores/fields";
import SelectMultiple from "@/components/Fields/Items/SelectMultiple";
import Select from "@/components/Fields/Items/Select";
import Number from "@/components/Fields/Items/Number";
import String from "@/components/Fields/Items/String";
import EmployeeField from "./EmployeeField";

interface FormLeadProps {
    loading: boolean;
    formdata: any;
    handleChange: () => any;
    statuses: any[];
    employees: any[];
    fields?: FieldProps[];
    errors?: any;
}

export default function FormLead(props: FormLeadProps) {

    const {
        loading,
        formdata,
        handleChange,
        statuses,
        employees,
        errors,
        fields,
    } = props;

    return <Form>

        <Form.Input
            label="Номер замера"
            placeholder="Введите номер замера"
            name="number"
            onChange={handleChange}
            value={formdata.number || ""}
            disabled={loading}
            error={errors?.number}
            required
        />

        {/* <Form.Select
            label="Статус"
            placeholder="Выберите статус"
            options={statuses.map((i: any) => ({
                value: i.id,
                text: <div className="flex items-center gap-3">
                    {i.color && <span className="w-3 h-3 rounded" style={{ background: i.color }}></span>}
                    <span>{i.name}</span>
                </div>,
            }))}
            name="status_id"
            onChange={handleChange}
            value={formdata.status_id || ""}
            required
            disabled={loading}
            error={errors?.status_id}
        /> */}

        <Form.Input
            label="Дата продажи"
            type="date"
            name="date_sale"
            onChange={handleChange}
            value={formdata.date_sale ? moment(formdata.date_sale).format("YYYY-MM-DD") : ""}
            disabled={loading}
            error={errors?.date_sale}
        />

        <Form.Input
            label="Дата поступления документов"
            type="date"
            name="date_sent_documents"
            onChange={handleChange}
            value={formdata.date_sent_documents ? moment(formdata.date_sent_documents).format("YYYY-MM-DD") : ""}
            disabled={loading}
            error={errors?.date_sent_documents}
        />

        <Form.Input
            label="Дата проверки"
            type="date"
            name="date_inspection"
            onChange={handleChange}
            value={formdata.date_inspection ? moment(formdata.date_inspection).format("YYYY-MM-DD") : ""}
            disabled={loading}
            error={errors?.date_inspection}
        />

        <Form.Input
            label="Дата выполненого перезамера"
            type="date"
            name="date_remeasurement"
            onChange={handleChange}
            value={formdata.date_remeasurement ? moment(formdata.date_remeasurement).format("YYYY-MM-DD") : ""}
            disabled={loading}
            error={errors?.date_remeasurement}
        />

        <Form.Input
            label="Дата запуска"
            type="date"
            name="date_start"
            onChange={handleChange}
            value={formdata.date_start ? moment(formdata.date_start).format("YYYY-MM-DD") : ""}
            disabled={loading}
            error={errors?.date_start}
        />

        <EmployeeField
            name="employee_id"
            onChange={handleChange}
            value={formdata.employee_id || ""}
            disabled={loading}
            error={errors?.employee_id}
            employees={employees || []}
        />

        {(fields || []).map((field: FieldProps) => {

            let Item: any = null;
            let props: any = {
                label: field.title,
                placeholder: field.placeholder,
                name: field.name,
                value: formdata[field.name] || "",
            }

            switch (field.typeKey) {
                case "input": Item = String; break;
                case "number": Item = Number; break;
                case "select": Item = Select; break;
                case "select_multiple": Item = SelectMultiple; break;
            }

            if (field.typeKey === "select" || field.typeKey === "select_multiple") {
                props.options = (field.options || []).map((i: string, k: number) => ({
                    key: k,
                    text: i,
                    value: i,
                }));
            }

            return Item && <Item
                {...props}
                key={field.id}
                onChange={handleChange}
                disabled={loading}
            />
        })}

    </Form>
}