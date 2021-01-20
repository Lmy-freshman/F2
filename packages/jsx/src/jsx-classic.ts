import JSX from './interface';

// 实现jsx-classic 入口
export default function(type: string | Function, config: any, ...children: any[]): JSX.Element {
  const { key, ref, ...props } = config || {};

  // 保持和automatic模式一致
  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }
  return {
    key,
    ref,
    type,
    props,
  };
};
