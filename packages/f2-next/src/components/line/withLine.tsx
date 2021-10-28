import { jsx } from '../../jsx';
import { isArray, mix } from '@antv/util';
import Geometry from '../geometry';
import { GeomType } from '../geometry/interface';
import { splitArray } from '../geometry/util';
import { each } from '@antv/util';

export default (View) => {
  return class Line extends Geometry {
    geomType: GeomType = 'line';

    _convertPosition(mappedArray) {
      const { props } = this;
      const { coord } = props;

      for (let i = 0; i < mappedArray.length; i++) {
        const data = mappedArray[i];
        for (let j = 0; j < data.length; j++) {
          const record = data[j];
          const { x, y } = record;
          mix(record, coord.convertPoint({ x, y: isArray(y) ? y[1] : y }));
        }
      }
      return mappedArray;
    }

    parsePoints(dataArray) {
      const { props } = this;
      const { coord } = props;
      return dataArray.map((data) => {
        const points = data;
        if (coord.isPolar) {
          points.push(data[0]);
        }
        return {
          ...data[0],
          points,
        };
      });
    }

    splitPoints(mappedArray) {
      const { field: yField } = this.attrOptions.y;
      const { connectNulls: defaultConnectNulls } = this;
      const { connectNulls = defaultConnectNulls } = this.props;
      each(mappedArray, function(obj) {
        const splitArrayObj = splitArray(obj.points, yField, connectNulls);
        obj.dataArray = splitArrayObj;
      });
      return mappedArray;
    }

    render() {
      const { props } = this;
      const { style, coord } = props;
      const mapped = this.mapping();
      const mappedArray = this.splitPoints(this.parsePoints(mapped));
      return <View coord={coord} mappedArray={mappedArray} style={style} />;
    }
  };
};
