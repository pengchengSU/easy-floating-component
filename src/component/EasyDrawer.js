import { useCallback, useMemo, useRef } from "react";
import { Drawer,Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";

const componentCallbacks = {};
export const componentReducer = (state = { hiding: {} }, action) => {
  switch (action.type) {
    case "easy-drawer/show":
      // componentId = true 或者 componentId = args 表示显示该组件
      // args 非空的话，作为参数通过 props 传递给该组件
      return {
        ...state,
        [action.payload.componentId]: action.payload.args || true,
        hiding: {
          ...state.hiding,
          [action.payload.componentId]: false,
        },
      };
    case "easy-drawer/hide":
      // force = true，componentId=false，表示删除该组件节点
      // force = false，不直接删除该组件节点，而是触发隐藏回调函数，等完全隐藏后，再执行 componentId=false，删除该节点
      // 具体实现原理结合下面 hide、EasyDrawer、useEasyDrawer 这三个 api 理解
      return action.payload.force
        ? {
          ...state,
          [action.payload.componentId]: false,
          hiding: { [action.payload.componentId]: false },
        }
        : { ...state, hiding: { [action.payload.componentId]: true } };
    default:
      return state;
  }
};

// 简化显示操作 action 对象的创建
function showDrawer(componentId, args) {
  return {
    type: "easy-drawer/show",
    payload: {
      componentId,
      args,
    },
  };
}

// 简化隐藏操作 action 对象的创建
function hideDrawer(componentId, force) {
  return {
    type: "easy-drawer/hide",
    payload: {
      componentId,
      force,
    },
  };
}

// 基于 Hooks 实现 EasyDrawer
export const useEasyDrawer = (componentId) => {
  const dispatch = useDispatch();

  const show = useCallback(
    (args) => {
      return new Promise((resolve) => {
        // 将 resolve 方法缓存起来，便于在其他地方调用 resolve() 改变当前 Promise 的状态
        componentCallbacks[componentId] = resolve;
        // 触发drawer 显示的 action 的下发
        dispatch(showDrawer(componentId, args));
      });
    },
    [dispatch, componentId],
  );

  const resolve = useCallback(
    (args) => {
      // EasyDrawer 对象的 resolve(value) 方法，使用之前缓存在 componentCallbacks 中的 resolve 方法调用
      // 传入的 args，可以在 EasyDrawer.show().then(value => { 处理value }) 中处理
      if (componentCallbacks[componentId]) {
        componentCallbacks[componentId](args);
        // Promise 只能调用一次 resolve
        delete componentCallbacks[componentId];
      }
    },
    [componentId],
  );

  // drawer 对象的隐藏方法
  // force 参数用于 drawer 的平滑渲染
  // force = true，直接删除 drawer 节点，返回 null
  // force = false，将 Drawer 的 open 属性置为 false，让其平滑收起后，调用 hide(true) 删除该节点，返回 null
  const hide = useCallback(
    (force) => {
      // 触发drawer 显示的 action 的下发
      dispatch(hideDrawer(componentId, force));
      // 组件节点都删除，也就不需要继续缓存对应的 resolve 回调方法了
      delete componentCallbacks[componentId];
    },
    [dispatch, componentId],
  );

  // 获取传给 drawer 对象的参数，通过 props 传递给该组件
  const args = useSelector((s) => s[componentId]);
  // 获取 drawer 组件的显示状态
  const hiding = useSelector((s) => s.hiding[componentId]);

  // 返回 drawer 组件的内部状态以及操作API
  return useMemo(
    () => ({ args, hiding, visible: !!args, show, hide, resolve }),
    [args, hide, show, resolve, hiding],
  );
};

// EasyDrawer 的实现，内部使用了 antd 的 Drawer
// 通过全局状态控制 Drawer 的显示，全局状态来自于 Redux 的 store
function EasyDrawer({ id, children, ...rest }) {
  const drawer = useEasyDrawer(id);
  return (
    <Drawer
      // hide(false)，伪关闭，其实调用组件的 open=false，触发其隐藏动画，实例还是在的
      onClose={() => drawer.hide()}
      // open=false，已经关闭了，afterOpenChange 表示其隐藏动画已经结束了，直接drawer.hide(true)，返回 null，节点下线
      // 这样做的的好处是，隐藏是平滑的，而不是闪退
      afterOpenChange={(open) => !open && drawer.hide(true)}
      open={!drawer.hiding}
      {...rest}
    >
      {children}
    </Drawer>
  );
}

// 创建 EasyDrawer 组件的API
// componentId 为组件的 id，全局唯一，否则会导致状态混乱
// Comp 为实际的组件
// 该方法将组件与 id 绑定
export const createEasyDrawer = (componentId, Comp) => {
  return (props) => {
    // 通过组件 id 获取该组件的状态
    const { visible, args } = useEasyDrawer(componentId);
    // 容器模式，visible=false，表示完全关闭，返回 null
    if (!visible) return null;
    // visible=true，渲染该组件
    return <Comp {...args} {...props} />;
  };
};

// 将 createEasyDrawer、useEasyDrawer 以 create、useDrawer 属性对外暴露
EasyDrawer.create = createEasyDrawer;
EasyDrawer.useDrawer = useEasyDrawer;

export default EasyDrawer;
