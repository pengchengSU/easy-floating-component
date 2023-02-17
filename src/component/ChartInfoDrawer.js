import { useCallback } from "react";
import {Button, Form} from "antd";
import FormBuilder from "antd-form-builder";
import EasyDrawer, { createEasyDrawer, useEasyDrawer } from "./EasyDrawer";
import SecondColumnInfoDrawer from "./SecondColumnInfoDrawer";

export default createEasyDrawer("chart-info-drawer", ({ chart }) => {
  const [form] = Form.useForm();
  const meta = {
    initialValues: chart,
    fields: [
      { key: "chartId", label: "ID", required: true },
      { key: "chartName", label: "图表名称", required: true },
      { key: "chartType", label: "图表类型", required: true },
    ],
  };
  const drawer = useEasyDrawer("chart-info-drawer");
  const columnDrawer = useEasyDrawer("second-column-info-drawer");

  const handleSubmit = useCallback(() => {
    form.validateFields().then(() => {
      drawer.resolve({ ...chart, ...form.getFieldsValue() });
      drawer.hide();
    });
  }, [drawer, chart, form]);

  return (
    <EasyDrawer
      id="chart-info-drawer"
      title={chart ? "Edit Chart" : "New Chart"}
      width={400}
    >
      <Form form={form}>
        <FormBuilder meta={meta} form={form} />
      </Form>
      <Button onClick={handleSubmit}>
        {chart ? "Update" : "Create"}
      </Button>
      <br />
      <br />
      <Button onClick={() => columnDrawer.show()}>
        Column二级抽屉
      </Button>
      <SecondColumnInfoDrawer />
    </EasyDrawer>
  );
});
