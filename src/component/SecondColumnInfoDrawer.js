import { useCallback } from "react";
import {Button, Form} from "antd";
import FormBuilder from "antd-form-builder";
import EasyDrawer, { createEasyDrawer, useEasyDrawer } from "./EasyDrawer";

export default createEasyDrawer("second-column-info-drawer", ({ chart }) => {
  const [form] = Form.useForm();
  const meta = {
    initialValues: chart,
    fields: [
      { key: "columnId", label: "ID", required: true },
      { key: "columnName", label: "列名称", required: true },
      { key: "columnType", label: "列类型", required: true },
    ],
  };
  const drawer = useEasyDrawer("second-column-info-drawer");

  const handleSubmit = useCallback(() => {
    form.validateFields().then(() => {
      drawer.resolve({ ...chart, ...form.getFieldsValue() });
      drawer.hide();
    });
  }, [drawer, chart, form]);

  return (
    <EasyDrawer
      id="second-column-info-drawer"
      title={chart ? "Edit Column" : "New Column"}
      width={400}
    >
      <Form form={form}>
        <FormBuilder meta={meta} form={form} />
      </Form>
      <Button onClick={handleSubmit}>
        {chart ? "Update" : "Create"}
      </Button>
    </EasyDrawer>
  );
});
