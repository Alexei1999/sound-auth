import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { actionCreators } from "src/reducers/actions";
import { RadioGroup } from "../../shared/RadioGroup";
import cn from "classnames";
import { useContextApp } from "src/reducers/reducer";

export function SelectExtraKey({ className = null }) {
  const [state, dispatch] = useContextApp();
  const {
    status,
    form: { selectedKey, selectedExtraKey, methods },
    view: { isExtra },
  } = state;

  const [showExtra, setShowExtra] = useState(null);

  return (
    <div className={cn(className)}>
      <CSSTransition
        classNames="extra"
        in={isExtra}
        timeout={300}
        unmountOnExit
        onEntered={() => setShowExtra(true)}
        onExiting={() => setShowExtra(false)}
      >
        <div>
          <RadioGroup
            status={status}
            isSkeleton={!showExtra}
            selected={selectedExtraKey}
            setSelected={(key) => dispatch(actionCreators.selectExtraItem(key))}
            items={methods?.[selectedKey]?.extra}
          />
        </div>
      </CSSTransition>
    </div>
  );
}
