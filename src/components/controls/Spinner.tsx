import { memo } from "react";


export default memo(function () {
  return (
    <div id="spinner" className="spinner-border" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </div>
  );
});