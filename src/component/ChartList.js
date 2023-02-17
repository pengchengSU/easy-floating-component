import { useMemo, useState } from "react";
import _ from "lodash";
import { Button, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEasyDrawer } from "./EasyDrawer";
import data from "./data";
import SecondColumnInfoDrawer from "./SecondColumnInfoDrawer";

export default () => {
  const { show: showDrawer } = useEasyDrawer("chart-info-drawer");
  const [charts, setCharts] = useState(data.slice(0, 5));
  const columns = useMemo(() => {
    return [
      {
        title: "Id",
        dataIndex: "chartId",
      },
      {
        title: "图表名称",
        dataIndex: "chartName",
      },
      {
        title: "图表类型",
        dataIndex: "chartType",
      },
      {
        title: "Actions",
        render(value, chart) {
          return (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                // .then()中，处理组件内部返回的数据 value，更新到列表
                showDrawer({ chart }).then((newChart) => {
                  setCharts((charts) => {
                    // 更新列表
                    const byId = _.keyBy(charts, "chartId");
                    byId[newChart.chartId] = newChart;
                    return _.values(byId);
                  });
                });
              }}
            />
          );
        },
      },
    ];
  }, [showDrawer]);

  return (
    <>
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={charts}
      />
    </>
  );
};
