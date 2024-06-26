import useApi from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import { Dimmer, Icon, Loader, Modal } from "semantic-ui-react";
import FormLead from "../Form/FormLead";
import useFormdata from "@/hooks/useFormdata";
import { axios } from "@/hooks/useAxios";
import { useAppDispatch } from "@/stores/hooks";
import { setLead } from "@/stores/leads";

interface EditLeadProps {
    leadId: null | number;
    close: () => void;
}

export default function EditLead(props: EditLeadProps) {

    const { leadId, close } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>({});
    const { formdata, handleChange, clear, setFormdata } = useFormdata();

    const dispatch = useAppDispatch();

    const update = useApi({
        success: (data) => {
            dispatch(setLead(data));
            close();
        }
    });

    const save = useCallback(() => {
        update.put(`leads/${leadId}`, formdata);
    }, [formdata]);

    useEffect(() => {
        if (leadId) {
            setLoading(true);
            axios.get(`leads/${leadId}/edit`)
                .then(({ data }) => {
                    setResponse(data);
                    setFormdata(data.lead || {});
                })
                .catch(e => {

                })
                .then(() => {
                    setLoading(false);
                });
        }
    }, [leadId]);

    useEffect(() => {
        return () => {
            clear();
        }
    }, []);

    return <Modal
        open={leadId !== null}
        header="Изменить заявку"
        centered={false}
        size="tiny"
        closeIcon={<Icon name="close" fitted link onClick={() => close()} />}
        content={<div className="p-5 relative">

            <FormLead
                loading={loading || update.isLoading}
                formdata={formdata}
                handleChange={handleChange}
                statuses={response.statuses || []}
                employees={response.employees || []}
                inspections={response.inspections || []}
                fields={response.fields || []}
            />

            <Dimmer active={loading} inverted>
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
                disabled: loading || update.isLoading || update.isError || update.isLoading,
                loading: update.isLoading,
            }
        ]}
    />
}