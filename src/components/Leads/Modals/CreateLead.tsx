import Message from "@/components/Views/Message";
import useApi from "@/hooks/useApi";
import useFormdata from "@/hooks/useFormdata";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { appendLead, setIsShowCreate } from "@/stores/leads";
import { useCallback, useEffect } from "react";
import { Dimmer, Form, Icon, Loader, Modal } from "semantic-ui-react";
import ClientField from "../Form/EmployeeField";
import FormLead from "../Form/FormLead";

export default function CreateLeads() {

    const open = useAppSelector((state) => state.leads.isShowCreate)
    const dispatch = useAppDispatch();
    const { formdata, handleChange, clear } = useFormdata();
    const create = useApi();
    const store = useApi({
        success: (data) => {
            dispatch(setIsShowCreate(false));
            dispatch(appendLead(data));
        }
    });

    const close = useCallback(() => {
        dispatch(setIsShowCreate(false));
        create.clear();
        store.clear();
        clear();
    }, []);

    useEffect(() => {
        if (open) {
            create.get('leads/create');
        }
    }, [open]);

    const save = useCallback(() => {
        store.post('leads', formdata);
    }, [formdata]);

    return <Modal
        open={open}
        header="Новая заявка"
        centered={false}
        size="tiny"
        closeIcon={<Icon name="close" fitted link onClick={() => close()} />}
        content={<div className="p-5 relative">

            {create.isError && <Message error content={create.error} className="!mb-0" />}
            {!create.isError && <Form>

                <FormLead
                    loading={store.isLoading}
                    formdata={formdata}
                    handleChange={handleChange}
                    statuses={create.response?.statuses || []}
                    employees={create.response?.employees || []}
                    inspections={create.response?.inspections || []}
                    fields={create.response?.fields || []}
                />

            </Form>}

            <Dimmer active={create.isLoading} inverted className="rounded">
                <Loader />
            </Dimmer>

        </div>}
        actions={[
            {
                key: "save",
                content: "Сохранить",
                icon: "save",
                positive: true,
                onClick: () => save(),
                disabled: create.isLoading || create.isError || store.isLoading,
                loading: store.isLoading,
            }
        ]}
    />
}
