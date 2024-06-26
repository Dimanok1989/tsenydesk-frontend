import { axios } from "@/hooks/useAxios";
import useFormdata from "@/hooks/useFormdata";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItemProps, Form, Icon, Message, Modal } from "semantic-ui-react";

type EmployeeFieldProps = {
    name?: string;
    label?: string;
    placeholder?: string;
    fluid?: boolean;
    onChange?: any;
    value?: any;
    disabled?: boolean;
    error?: string;
    employees: EmployeeOption[],
};

type EmployeeOption = any;

let timeout: any = null;

export default function EmployeeField({
    name,
    label,
    placeholder,
    fluid,
    disabled,
    onChange,
    value,
    employees,
}: EmployeeFieldProps) {

    const [addShow, setAddShow] = useState<boolean>(false);
    const [options, setOptions] = useState<EmployeeOption[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const controller = useRef<any>(null);

    const { formdata, handleChange, clear } = useFormdata();
    const [store, setStore] = useState<boolean>(false);
    const [storeError, setStoreError] = useState<string | null>(null);

    useEffect(() => {
        setOptions(employees);
    }, [employees]);

    useEffect(() => {
        !addShow && clear();
        !addShow && setStoreError(null);
    }, [addShow]);

    const handleSearchChange = (e: any, { searchQuery }: any) => {

        controller.current && controller.current.abort();
        controller.current = new AbortController();
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            setIsFetching(true);
            axios.get('employees/search', {
                params: { query: searchQuery },
                signal: controller.current.signal
            }).then(({ data }) => {
                setError(null);
                setOptions(data.data)
            }).catch(err => {
                setError(err?.response?.message || err?.message || "Ошибка");
            }).then(() => {
                setIsFetching(false);
            });
        }, 300);
    }

    useEffect(() => {

        if (store) {
            axios.post('employees', formdata)
                .then(({ data }) => {
                    setStoreError(null);
                    setOptions(p => ([data, ...p]));
                    if (typeof onChange == "function") {
                        onChange(null, { name, value: data.id });
                    }
                    setAddShow(false);
                })
                .catch(err => {
                    setStoreError(err?.response?.message || err?.message || "Ошибка");
                })
                .then(() => {
                    setStore(false);
                });
        }

    }, [store]);

    return <Form.Field>
        <label>Сотурдник</label>
        <Dropdown
            name={name}
            label={label || "Сотурдник"}
            placeholder={placeholder || "Выберите сотурдника"}
            selection
            fluid={fluid}
            options={options.map(i => ({ key: i.id, value: i.id, text: i.fullname }))}
            noResultsMessage="Ничего не найдено"
            search
            onSearchChange={handleSearchChange}
            onChange={onChange}
            loading={isFetching}
            disabled={disabled}
            error={Boolean(error)}
            value={value}
        />
        <div className="mt-2 text-blue-500 flex items-center justify-end opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setAddShow(true)}>
            <Icon name="user plus" />
            <span>Добавить сотурдника</span>
        </div>

        <Modal
            open={addShow}
            dimmer="inverted"
            header="Новый сотурдник"
            closeIcon={!Boolean(store) && <Icon
                name="close"
                color="black"
                link
                fitted
                onClick={() => setAddShow(false)}
            />}
            size="mini"
            content={<div className="p-5 relative">

                <Form loading={Boolean(store)} className="mt-1">
                    {/* <Form.Input
                        label="Телефон"
                        placeholder="Укажите номер телефон"
                        required
                        name="phone"
                        onChange={handleChange}
                        value={formdata.phone || ""}
                        icon="phone"
                    /> */}
                    <Form.Input
                        label="Фамилия"
                        placeholder="Укажите фамилию"
                        required
                        name="lastname"
                        onChange={handleChange}
                        value={formdata.lastname || ""}
                    />
                    <Form.Input
                        label="Имя"
                        placeholder="Укажите имя"
                        name="name"
                        onChange={handleChange}
                        value={formdata.name || ""}
                    />
                    <Form.Input
                        label="Отчество"
                        placeholder="Укажите отчество"
                        name="patronymic"
                        onChange={handleChange}
                        value={formdata.patronymic || ""}
                    />
                    {storeError && <p className="text-red-500 font-bold">{storeError}</p>}
                    <Button
                        content="Добавить"
                        color={storeError ? "red" : "green"}
                        fluid
                        icon="save"
                        labelPosition="left"
                        disabled={!Boolean(formdata.lastname)}
                        onClick={() => setStore(true)}
                    />
                </Form>

            </div>}
        />

    </Form.Field>
}