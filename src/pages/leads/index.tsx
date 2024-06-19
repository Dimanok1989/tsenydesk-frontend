import Content from "@/components/Content";
import FieldsSidebar from "@/components/Fields/FieldsSidebar";
import CreateLeads from "@/components/Leads/Modals/CreateLead";
import TableLeads from "@/components/Leads/TableLeads";
import EmptyData from "@/components/Views/EmptyData";
import useApi from "@/hooks/useApi";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setFields, setIsShowCreate, setLeads } from "@/stores/leads";
import { useEffect, useState } from "react"
import { Icon, Loader } from "semantic-ui-react";

export default function Leads() {

    const [loading, setLoading] = useState(true);
    const http = useApi();

    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.leads);

    useEffect(() => {
        setLoading(true);
        http.get('leads');
    }, []);

    useEffect(() => {
        dispatch(setFields(http.response?.meta?.fields || []));
        dispatch(setLeads(http.response?.data || []));
        setLoading(false);
    }, [http.response?.data]);

    return <Content
        full
        title="Заявки"
        loading={loading}
        error={http.error}
        actions={<div className="mx-3 flex gap-4">
            <Icon
                name="plus"
                fitted
                link
                onClick={() => dispatch(setIsShowCreate(true))}
                title="Добавить новую заявку"
                size="large"
            />
            {/* <FieldsSidebar /> */}
            {/* <Button onClick={() => dispatch(setIsShowCreate(true))} content="Добавить" /> */}
        </div>}
    >
        {(http.isLoading || loading) && <Loader inline="centered" active className="mt-5" />}
        {!http.isLoading && <>
            <CreateLeads />
            {data.leads.length === 0 && <EmptyData />}
            {data.leads.length > 0 && <TableLeads />}
        </>}
    </Content>
}
