import { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/soundManager';
import { getMenus } from '../../constants/menuConfig';

const MenuBar = ({ onOpenWindow }) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (activeMenu) {
          playSound('mnuc');
        }
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus = getMenus(onOpenWindow, activeMenu);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        borderBottom: '2px solid #000',
        borderTop: '2px solid #000',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        boxShadow: '0 -14px 0 0 #000', // fill uncovered top area with black
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px',
        background: '#fff',
        height: '32px', // thick and round menu bar like classic mac os
        userSelect: 'none',
        fontFamily: 'Chicago, sans-serif'
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {Object.entries(menus).map(([key, menu]) => (
          <div key={key} style={{ position: 'relative', height: '100%', fontSize: '18px', fontWeight: 'bold' }}>
            <div
              onMouseDown={() => {
                const wasOpen = activeMenu === key;
                const newMenu = wasOpen ? null : key;
                if (!wasOpen) playSound('mnuo');
                else playSound('mnuc');
                setActiveMenu(newMenu);
              }}
              onMouseEnter={() => {
                if (activeMenu && activeMenu !== key) {
                  playSound('mnuo');
                  setActiveMenu(key);
                }
              }}
              style={{
                padding: '0 10px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                cursor: 'default',
                background: activeMenu === key ? '#000' : 'transparent',
                color: activeMenu === key ? '#fff' : '#000'
              }}
            >
              <span style={{ fontSize: key === 'apple' ? '1.2rem' : '1rem', lineHeight: '1', display: 'flex', alignItems: 'center' }}>
                {menu.label}
              </span>
            </div>

            {activeMenu === key && (
              <div style={{
                position: 'absolute',
                top: '32px',
                left: 0,
                background: '#fff',
                border: '1px solid #000',
                boxShadow: '2px 2px 0px #000',
                minWidth: '200px',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                padding: '0'
              }}>
                {menu.items.map((item, index) => {
                  if (item.type === 'separator') {
                    return <div key={index} style={{ borderTop: '1px dotted #000', margin: '4px 0' }} />;
                  }
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (!item.disabled) {
                          item.action && item.action();
                          setActiveMenu(null);
                        }
                      }}
                      style={{
                        padding: '2px 15px',
                        cursor: item.disabled ? 'default' : 'default',
                        color: item.disabled ? '#999' : '#000',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (!item.disabled) {
                          playSound('mnui');
                          e.currentTarget.style.background = '#000';
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!item.disabled) {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#000';
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      {item.checked && <span style={{ marginLeft: '10px' }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ cursor: 'default', paddingRight: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default MenuBar;
