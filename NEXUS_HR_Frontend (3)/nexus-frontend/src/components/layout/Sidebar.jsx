import { NavLink } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { to: '/', label: "Today's Story", icon: 'home' },
      { to: '/directory', label: 'Directory', icon: 'people' },
      { to: '/profile', label: 'Profile', icon: 'user' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/attendance', label: 'Attendance', icon: 'clock' },
      { to: '/payroll', label: 'Payroll', icon: 'card' },
      { to: '/leave', label: 'Leave', icon: 'calendar' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/recruitment', label: 'Recruitment', icon: 'star' },
      { to: '/organization', label: 'Organization', icon: 'org' },
      { to: '/analytics', label: 'Analytics', icon: 'chart' },
    ],
  },
];

const ICONS = {
  home: <path d="M4 12l8-7 8 7M6 10v9h12v-9" />,
  people: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><circle cx="17" cy="8" r="2.6" /><path d="M15.5 14.3c2.6.4 4.5 2.6 4.5 5.7" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20.5c0-4 3-7 7-7s7 3 7 7" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  card: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M3.5 10h17" /><path d="M7 14.5h3" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 9.5h17" /><path d="M8 3v4M16 3v4" /></>,
  star: <path d="M12 3l2.4 5.1L20 9l-4 4 1 5.6L12 16l-5 2.6 1-5.6-4-4 5.6-.9z" />,
  org: <><circle cx="12" cy="4.5" r="2" /><circle cx="6" cy="14" r="2" /><circle cx="18" cy="14" r="2" /><circle cx="12" cy="20" r="2" /><path d="M12 6.5v3M12 9.5L6 12M12 9.5l6 2.5" /></>,
  chart: <path d="M4 20V10M11 20V4M18 20v-7" />,
  shield: <><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /><path d="M9.5 12l1.8 1.8L14.8 10" /></>,
};

const ADMIN_ROLES = ['Admin', 'HR Manager'];

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {ICONS[name]}
    </svg>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  const groups = isAdmin
    ? [...NAV_GROUPS, { label: 'Admin', items: [{ to: '/roles', label: 'Roles', icon: 'shield' }] }]
    : NAV_GROUPS;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-text">
          <div className="name">NEXUS HR</div>
          <div className="tag">People &middot; Intelligence &middot; Future</div>
        </div>
      </div>

      {groups.map((group) => (
        <div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-foot">
        <div className="me" onClick={logout} title="Sign out">
          <Avatar name={user?.fullName || 'User'} size={38} />
          <div className="txt">
            <b>{user?.fullName || 'Guest'}</b>
            <span>{user?.role || 'Sign out'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
