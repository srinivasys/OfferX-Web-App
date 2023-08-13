import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/routes-names';

type Props = {};

const HeaderInvite: React.FC<Props> = () => {
    return (
        <div className="dropdown lt-dropdown-menu px-md-2">
            <a
                href="_"
                className="btn btn-secondary dropdown-toggle"
                role="button"
                id="InviteFriends"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-envelope-open me-0" />
                <span>Invite</span>
            </a>
            <ul className="dropdown-menu invite-friends lt-shadow-tin py-0" aria-labelledby="InviteFriends">
                <li>
                    <button type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#AddInvite">
                        <i className="bi bi-person" />
                        Invite Candidate
                    </button>
                </li>
                <li>
                    <Link to={routes.invitations} className="dropdown-item">
                        <i className="bi bi-list-ul" />
                        Invitations List
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default HeaderInvite;
