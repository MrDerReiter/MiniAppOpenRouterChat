import { memo, useEffect, useState, type CSSProperties } from "react";
import type { AIModelInfo } from "../../service/AIAgent"
import Spinner from "../controls/Spinner";
import ErrorMessage from "../controls/ErrorMessage";


type ModelSelectorProps = {
  dataSource: Promise<AIModelInfo[]>;
  onModelSelected: (modelID: string) => void;
}

const list: CSSProperties = {
  margin: 15,
  padding: 0,
  minWidth: "20%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}


export default memo(function (props: ModelSelectorProps) {
  const { dataSource, onModelSelected } = props;
  const [models, setModels] = useState<AIModelInfo[]>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dataSource
      .then(setModels)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, []);

  return (
    <>
      <h1>Выберите LLM из списка:</h1>
      <ul style={list} hidden={isLoading}>
        {!error ?
          models?.map((model, index) => {
            return (
              <li className="model-button" key={index}
                onClick={() => onModelSelected(model.id)}>
                {model.name.replace(" (free)", "")}
              </li>)
          }) :
          <ErrorMessage alertText={error.message}>
            Проверьте соединение с интернетом и/или попробуйте обновить страницу.
          </ErrorMessage>
        }</ul>
      {isLoading && <Spinner />}
    </>
  );
});