import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}

export default function Tabs({ tabs, activeId, onChange, ariaLabel }: TabsProps) {
  return (
    <div className={styles.list} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
