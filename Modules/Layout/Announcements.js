import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { resizeWindow } from "../../usejQuery";
import { AnnouncementsSelector } from "./../Home/HomeSlice";

export default function Announcements() {
  const Announcement = useSelector(AnnouncementsSelector);

  useEffect(() => {
    resizeWindow();
  }, [Announcement]);

  return (
    <>
      {Announcement &&
        Announcement.map((obj, index) => {
          return (
            <React.Fragment key={`Announcement${index}`}>
              <li className="nav-item" key={`Announcement${index}`}>
                <p className="nav-link">{obj}</p>
              </li>
            </React.Fragment>
          );
        })}
    </>
  );
}
