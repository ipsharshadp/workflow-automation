import React from "react";
import Drawer from "./Drawer";

export default function ConditionDrawer({
    isOpen,
    onClose,
    conditions,
    onSelectCondition,
}) {
    return (
        <Drawer title="Condition (IF / AND / OR)" isOpen={isOpen} onClose={onClose}>
            <div className="picker-section">
                <h4>Conditions</h4>

                <div className="picker-list">
                    {conditions?.map((cond) => (
                        <button
                            key={cond.id}
                            className="picker-item"
                            onClick={() => onSelectCondition(cond)}
                        >
                            {cond.name}
                        </button>
                    ))}
                </div>
            </div>
        </Drawer>
    );
}
