import { useMemo } from "react";
import {Button, message} from "antd";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { componentReducer, useEasyDrawer } from "./EasyDrawer";
import ChartInfoDrawer from "./ChartInfoDrawer";
import ChartList from "./ChartList";

// redux store
const store = createStore(componentReducer);

function ChartLayout() {
  const drawer = useEasyDrawer("chart-info-drawer");

  const handleClick = () => {
    // .then()中，处理组件内部返回的数据 value
    drawer.show().then(value => {
      message.info(`新增报表，id=${value.chartId}，chartName=${value.chartName}`);
    })
  }

  return (
    <div className="demo-charts">
      <sider>
        <Button type="primary" onClick={handleClick}>
          + New Chart
        </Button>
      </sider>
      <section>
        <ChartList />
      </section>

      {/*自定义的 EasyDrawer 放在当前组件中*/}
      <ChartInfoDrawer />
    </div>
  );
}

export default () => {
  return (
    // Redux Store
    <Provider store={store}>
      <ChartLayout />
    </Provider>
  );
};
