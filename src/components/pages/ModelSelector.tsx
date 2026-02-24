import { memo, useEffect, useState } from "react";
import Spinner from "../controls/Spinner";
import ErrorMessage from "../controls/ErrorMessage";
import "../../../style/modelSelector.css";


type ModelSelectorProps = {
  dataSource: Promise<IAIModel[]>;
  onModelSelected: (modelID: string) => void;
}

export default memo(function (props: ModelSelectorProps) {
  const { dataSource, onModelSelected } = props;
  const [models, setModels] = useState<IAIModel[]>();
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
      <ul className="models-list" hidden={isLoading}>{
        !error ?
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