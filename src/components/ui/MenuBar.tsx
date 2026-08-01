import { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/soundManager';
import { getMenus } from '../../constants/menuConfig';

interface MenuBarProps {
  onOpenWindow: (key: string) => void;
  onCrash?: () => void;
}

const MenuBar = ({ onOpenWindow, onCrash }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
        if (activeMenu) {
          playSound('mnuc');
          setActiveMenu(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allMenus = getMenus(onOpenWindow, activeMenu, onCrash);
  const menus = isMobile
    ? {
      apple: allMenus.apple,
      leocodes: {
        label: 'LeoCodes',
        items: [
          { label: 'About Me', action: () => onOpenWindow('about') },
          { label: 'Projects', action: () => onOpenWindow('projects') },
          { label: 'Contact Me', action: () => onOpenWindow('contactMe') },
          { type: 'separator' },
          { label: 'Restart', action: () => window.location.reload() }
        ]
      }
    }
    : allMenus;

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
        boxShadow: '0 -14px 0 0 #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px',
        background: '#fff',
        height: '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        fontFamily: 'Chicago, sans-serif'
      }}
    >
      <div style={{ display: 'flex', height: '100%' }} role="menubar">
        {Object.entries(menus).map(([key, menu]) => (
          <div key={key} style={{ position: 'relative', height: '100%', fontSize: '18px', fontWeight: 'bold' }} role="none">
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const wasOpen = activeMenu === key;
                  const newMenu = wasOpen ? null : key;
                  if (!wasOpen) playSound('mnuo');
                  else playSound('mnuc');
                  setActiveMenu(newMenu);
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
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeMenu === key}
              tabIndex={0}
            >
              <span style={{ lineHeight: '1', display: 'flex', alignItems: 'center' }}>
                {menu.label}
              </span>
            </div>

            {activeMenu === key && (
              <div
                role="menu"
                style={{
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
                }}
              >
                {menu.items.map((item: any, index: number) => {
                  if (item.type === 'separator') {
                    return <div key={index} style={{ borderTop: '1px dotted #000', margin: '4px 0' }} role="separator" />;
                  }
                  return (
                    <div
                      key={index}
                      role="menuitem"
                      tabIndex={item.disabled ? -1 : 0}
                      onClick={() => {
                        if (!item.disabled) {
                          playSound('mnus');
                          item.action && item.action();
                          setActiveMenu(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!item.disabled) {
                            playSound('mnus');
                            item.action && item.action();
                            setActiveMenu(null);
                          }
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
                      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                        if (!item.disabled) {
                          playSound('mnui');
                          e.currentTarget.style.background = '#000';
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                        if (!item.disabled) {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#000';
                        }
                      }}
                      onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
                        if (!item.disabled) {
                          playSound('mnui');
                          e.currentTarget.style.background = '#000';
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
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
      <div style={{ cursor: 'default', paddingRight: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default MenuBar;
