import {
  Container,
  Divider,
  render,
  VerticalSpace,
  Textbox,
  TabsOption,
  SelectableItem,
  Button,
} from "@create-figma-plugin/ui";
import { emit, EventHandler, once } from "@create-figma-plugin/utilities";
import { h, JSX } from "preact";
import { useCallback, useState } from "preact/hooks";
import { Filter, LightbulbItem, ToggleWidget } from "./types";
import styles from "./styles.css";
import { colors } from "./icons";

const initFilter: Filter = {
  "Design Rationale": true,
  Function: true,
  Behavior: true,
  "Additional Context": true,
  Task: true,
  Problems: true,
};

const sort: string[] = ["date", "unread", "author"];

function Plugin(props: { text: string }) {
  const [lightbulbList, setLightbulbList] = useState<LightbulbItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [tab, setTab] = useState<string>("Categories");
  const [hide, setHide] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>(initFilter);
  const [sortBy, setSortBy] = useState<string>("date");

  once("ARCHIVE", (newLightbulbList) => handleUpdateArchive(newLightbulbList));
  function handleUpdateArchive(newLightbulbList: LightbulbItem[]) {
    console.log(newLightbulbList);
    setLightbulbList(
      newLightbulbList
        .sort((a, b) => b.lastEditTime.num - a.lastEditTime.num)
        .map((d) => {
          d.answers.forEach((ans) => (ans.expanded = false));
          return d;
        })
    );
  }

  const handleFocusButtonClick = useCallback(
    function (id: string) {
      emit("UPDATE_FOCUS", id);
    },
    [lightbulbList]
  );

  const handleDeleteButtonClick = (index: number, widgetId: string) => {
    console.log("delete index ", index);
    let newList = [...lightbulbList];
    newList.splice(index, 1);
    console.log("splice ", newList);
    setLightbulbList(newList);
    emit("UPDATE_LIST", newList, widgetId);
  };

  const handleSearchInput = (newValue: string) => {
    console.log(newValue);
    setSearch(newValue);

    let re = new RegExp(newValue, "i");
    if (newValue !== "") {
      // expand all, filter with keyword
      const newList = lightbulbList.map((d, index) => {
        d.answers.forEach((ans, ansIdx) => {
          ans.expanded = true;
          ans.hasKeyword = re.test(ans.answer);
          // highlight keyword in answer
          if (ans.hasKeyword) {
            let ele: any = document.getElementById(`${index}-${ansIdx}`);
            console.log(ele);
            console.log(`${index}-${ansIdx}`);
            ele.innerHTML = ans.answer?.replace(re, function (x) {
              return `<b>${x}</b>`;
            });
          }
          return ans;
        });
        return d;
      });
      setLightbulbList(newList);
    } else {
      setLightbulbList(
        lightbulbList.map((d) => {
          d.answers.forEach((ans) => {
            ans.expanded = false;
            ans.hasKeyword = true;
            return ans;
          });
          return d;
        })
      );
      Array.from(document.getElementsByClassName("test")).forEach((e) => {
        let [index, ansIdx]: number[] = e.id.split("-").map((d) => parseInt(d));
        let answer: string = lightbulbList[index].answers[ansIdx].answer;
        e.innerHTML = answer;
      });
    }
  };

  const toggleHide = () => {
    emit<ToggleWidget>("TOGGLE_WIDGET", hide);
    setHide(!hide);
  };

  const handleChangeTab = (tab: string) => {
    setTab(tab);
    console.log(lightbulbList);
  };

  const handleChangeFilter = (
    event: JSX.TargetedEvent<HTMLInputElement>,
    category: string
  ) => {
    const newValue = event.currentTarget.checked;
    let newFilter = { ...filter };
    newFilter[category] = newValue;
    setFilter(newFilter);
  };

  const handleChangeSortBy = (
    event: JSX.TargetedEvent<HTMLInputElement>,
    sortRule: string
  ) => {
    // if the current value is already checked, do nothing, else change the sort by rule
    if (event.currentTarget.checked) {
      setSortBy(sortRule);
      if (sortRule == "date")
        setLightbulbList(
          lightbulbList.sort((a, b) => b.lastEditTime.num - a.lastEditTime.num)
        );
    }
  };

  const handleExpand = (index: number, ansIdx: number) => {
    let newList = [...lightbulbList];
    newList[index].answers[ansIdx].expanded =
      !newList[index].answers[ansIdx].expanded;
    console.log(newList);
    setLightbulbList(newList);
  };

  return (
    <Container space="extraSmall">
      <VerticalSpace space="small" />
      <div className={styles.header}>
        <div class={styles.searchbar}>
          <svg
            width="24"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9579 12.9937L9.41321 8.44896C10.1185 7.53722 10.5 6.42247 10.5 5.24998C10.5 3.84648 9.95221 2.53049 8.96171 1.53824C7.97121 0.545998 6.65172 0 5.24998 0C3.84823 0 2.52874 0.547748 1.53824 1.53824C0.545998 2.52874 0 3.84648 0 5.24998C0 6.65172 0.547748 7.97121 1.53824 8.96171C2.52874 9.95396 3.84648 10.5 5.24998 10.5C6.42247 10.5 7.53547 10.1185 8.44721 9.41496L12.9919 13.9579C13.0053 13.9713 13.0211 13.9819 13.0385 13.9891C13.0559 13.9963 13.0746 14 13.0934 14C13.1123 14 13.131 13.9963 13.1484 13.9891C13.1658 13.9819 13.1816 13.9713 13.1949 13.9579L13.9579 13.1967C13.9713 13.1834 13.9819 13.1675 13.9891 13.1501C13.9963 13.1327 14 13.114 14 13.0952C14 13.0763 13.9963 13.0577 13.9891 13.0403C13.9819 13.0228 13.9713 13.007 13.9579 12.9937ZM8.02197 8.02197C7.27997 8.76221 6.29647 9.16996 5.24998 9.16996C4.20348 9.16996 3.21999 8.76221 2.47799 8.02197C1.73774 7.27997 1.32999 6.29647 1.32999 5.24998C1.32999 4.20348 1.73774 3.21824 2.47799 2.47799C3.21999 1.73774 4.20348 1.32999 5.24998 1.32999C6.29647 1.32999 7.28172 1.73599 8.02197 2.47799C8.76221 3.21999 9.16996 4.20348 9.16996 5.24998C9.16996 6.29647 8.76221 7.28172 8.02197 8.02197Z"
              fill="#27251F"
            />
          </svg>
          {/* <SearchTextbox onValueInput={handleSearchInput} value={search} /> */}
          <Textbox
            onValueInput={handleSearchInput}
            placeholder="Search..."
            value={search}
            variant="border"
            style={{ width: 200 }}
          />
          {/* <Button>Search</Button> */}
        </div>
        <div style={{ cursor: "pointer" }}>
          <div className={styles["dropdown"]}>
            <svg
              onClick={() => setMenu(!menu)}
              style={{ cursor: "pointer" }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="7" cy="7" r="6.5" stroke="black" />
              <line x1="3" y1="5.5" x2="11" y2="5.5" stroke="black" />
              <line x1="4" y1="7.5" x2="10" y2="7.5" stroke="black" />
              <line x1="5" y1="9.5" x2="9" y2="9.5" stroke="black" />
            </svg>
            <div
              id="myDropdown"
              className={styles["dropdown-content"]}
              style={{ display: menu ? "block" : "none" }}
            >
              {/* sort by */}
              {sort.map((d) => (
                <SelectableItem
                  onChange={(event) => handleChangeSortBy(event, d)}
                  value={sortBy == d}
                >
                  Sort by {d}
                </SelectableItem>
              ))}
              <VerticalSpace space="extraSmall" />
              <Divider />
              <VerticalSpace space="extraSmall" />

              {/* filter by category */}
              {Object.keys(initFilter).map((category) => (
                <SelectableItem
                  onChange={(event) => handleChangeFilter(event, category)}
                  value={filter[category]}
                >
                  {category}
                </SelectableItem>
              ))}
            </div>
          </div>
        </div>
        <div onClick={toggleHide} style={{ cursor: "pointer" }}>
          {hide ? (
            <svg
              width="16"
              height="7"
              viewBox="0 0 16 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1C1 1 3.45 3.8 8 3.8C12.55 3.8 15 1 15 1M2.4 2.1515L1 3.8M15 3.8L13.6028 2.1536M5.8398 3.576L5.2 5.55M10.1441 3.5816L10.8 5.55"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.7411 5.25857C15.0863 5.70143 15.0863 6.29929 14.7411 6.74143C13.6539 8.13357 11.0455 11 8.00011 11C4.95475 11 2.34631 8.13357 1.2591 6.74143C1.09116 6.52938 1 6.26851 1 6C1 5.73149 1.09116 5.47062 1.2591 5.25857C2.34631 3.86643 4.95475 1 8.00011 1C11.0455 1 13.6539 3.86643 14.7411 5.25857V5.25857Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.00013 8.14283C9.20666 8.14283 10.1847 7.18344 10.1847 5.99997C10.1847 4.81651 9.20666 3.85712 8.00013 3.85712C6.79359 3.85712 5.81551 4.81651 5.81551 5.99997C5.81551 7.18344 6.79359 8.14283 8.00013 8.14283Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      <VerticalSpace space="small" />
      {/* manually immplement the tab */}
      <div>
        <span
          className={
            tab == "Questions"
              ? styles["tab-option-selected"]
              : styles["tab-option"]
          }
          onClick={() => handleChangeTab("Questions")}
        >
          Questions
        </span>
        <span
          className={
            tab == "Categories"
              ? styles["tab-option-selected"]
              : styles["tab-option"]
          }
          onClick={() => handleChangeTab("Categories")}
        >
          Categories
        </span>
      </div>
      <VerticalSpace space="small" />
      <Divider />
      <VerticalSpace space="small" />
      {lightbulbList.map(
        (obj, index) => (
          // obj.answers.filter(
          //   (answer) =>
          //     filter[answer.category] && answer.answered && answer.hasKeyword
          // ).length ? (
          <div
            hidden={
              obj.answers.filter(
                (answer) =>
                  filter[answer.category] &&
                  answer.answered &&
                  answer.hasKeyword
              ).length == 0
            }
          >
            <div class={styles["sidebar-container"]}>
              <div
                class={styles["parent-row"]}
                onClick={() => handleFocusButtonClick(obj.parentNode.id)}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="29"
                    height="29"
                    rx="4.5"
                    fill="white"
                    stroke="#27251F"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.7738 14.9283C21.5473 13.8119 22 12.4599 22 11.0031C22 7.16991 18.866 4.0625 15 4.0625C11.134 4.0625 8 7.16991 8 11.0031C8 12.3404 8.38146 13.5894 9.04238 14.6489L11.7458 19.5301H17.8475L20.7738 14.9283Z"
                    fill="#FDB827"
                  />
                  <path
                    d="M20.7738 14.9283L20.3628 14.6436L20.3572 14.6517L20.3519 14.66L20.7738 14.9283ZM9.04238 14.6489L9.47977 14.4066L9.47348 14.3953L9.46661 14.3843L9.04238 14.6489ZM11.7458 19.5301L11.3084 19.7723L11.4512 20.0301H11.7458V19.5301ZM17.8475 19.5301V20.0301H18.1221L18.2695 19.7984L17.8475 19.5301ZM21.5 11.0031C21.5 12.3546 21.0804 13.6079 20.3628 14.6436L21.1848 15.2131C22.0142 14.0159 22.5 12.5652 22.5 11.0031H21.5ZM15 4.5625C18.5939 4.5625 21.5 7.45006 21.5 11.0031H22.5C22.5 6.88976 19.1381 3.5625 15 3.5625V4.5625ZM8.5 11.0031C8.5 7.45006 11.4061 4.5625 15 4.5625V3.5625C10.8619 3.5625 7.5 6.88976 7.5 11.0031H8.5ZM9.46661 14.3843C8.85365 13.4016 8.5 12.2439 8.5 11.0031H7.5C7.5 12.4369 7.90927 13.7771 8.61815 14.9135L9.46661 14.3843ZM12.1832 19.2878L9.47977 14.4066L8.60499 14.8911L11.3084 19.7723L12.1832 19.2878ZM17.8475 19.0301H11.7458V20.0301H17.8475V19.0301ZM20.3519 14.66L17.4256 19.2618L18.2695 19.7984L21.1957 15.1966L20.3519 14.66Z"
                    fill="#27251F"
                  />
                  <path
                    d="M12.1109 22.7797C12.0886 22.8875 12.098 22.9814 12.1084 23.0856C12.1106 23.1071 12.1128 23.129 12.1148 23.1516C12.132 23.3304 12.1551 23.5011 12.2646 23.6454C12.3119 23.7082 12.3696 23.7644 12.4274 23.8207C12.4986 23.8902 12.5699 23.9597 12.6219 24.0416L12.1109 22.7797ZM12.1109 22.7797C12.1397 22.6374 12.0956 22.5805 11.9957 22.4688C11.9865 22.4585 11.9772 22.4482 11.9677 22.4377C11.8704 22.3298 11.762 22.2096 11.7095 22.0725M12.1109 22.7797L13.043 23.7721M13.043 23.7721C13.1369 23.9183 13.1711 24.0707 13.189 24.1575C13.1983 24.2032 13.2041 24.2341 13.2084 24.2567C13.2148 24.2911 13.2178 24.3067 13.2243 24.3268C13.2696 24.4569 13.3956 24.623 13.5141 24.7094C13.5461 24.7323 13.5808 24.7442 13.7042 24.7868C13.7193 24.792 13.7357 24.7976 13.7537 24.8038C13.8883 24.8504 14.1179 24.9333 14.306 25.1381L14.3072 25.1395C14.4972 25.3481 14.7247 25.4481 14.9022 25.4366L14.9037 25.4365C14.9897 25.4312 15.0701 25.3973 15.1945 25.2983C15.2518 25.2528 15.3069 25.203 15.3763 25.1405C15.3875 25.1303 15.3991 25.1198 15.4112 25.109C15.4918 25.0364 15.5896 24.9497 15.7 24.8692L13.043 23.7721ZM13.043 23.7721C12.9616 23.6443 12.8604 23.5449 12.7973 23.4832C12.7933 23.4793 12.7895 23.4755 12.7857 23.4718C12.7173 23.4048 12.6872 23.3754 12.6639 23.3445L12.6639 23.3445L12.6629 23.3431C12.6573 23.3357 12.6483 23.3214 12.639 23.2855C12.6283 23.2446 12.6211 23.1924 12.6126 23.1056C12.6104 23.0805 12.6078 23.0538 12.6056 23.0318C12.6047 23.0229 12.6039 23.0147 12.6032 23.0077C12.6004 22.9791 12.5987 22.9586 12.5979 22.941C12.5963 22.9088 12.5981 22.8931 12.6006 22.8809L12.6006 22.8809L12.601 22.879C12.6292 22.7396 12.6322 22.5798 12.5603 22.414C12.506 22.2886 12.4185 22.1913 12.3757 22.1437C12.3731 22.1408 12.3707 22.1381 12.3685 22.1356L12.3681 22.1352C12.3563 22.122 12.3452 22.1096 12.3347 22.098C12.2919 22.0505 12.2598 22.0149 12.2293 21.9758C12.1933 21.9297 12.1803 21.904 12.1764 21.8936L11.7095 22.0725M11.7095 22.0725C11.6115 21.8145 11.5424 21.4731 11.6768 21.217C11.8362 20.9122 12.1647 21.0402 12.3971 21.154M11.7095 22.0725L12.1769 21.8951C12.1387 21.7943 12.1118 21.6913 12.1042 21.6016C12.1032 21.5897 12.1025 21.5786 12.1022 21.5682M12.3971 21.154L12.1743 21.6016C12.1748 21.6019 12.1754 21.6022 12.1759 21.6024M12.3971 21.154L12.1773 21.6031C12.1768 21.6029 12.1763 21.6026 12.1759 21.6024M12.3971 21.154C12.691 21.3003 13.006 21.4019 13.321 21.4853M12.1759 21.6024C12.1496 21.5896 12.1251 21.5781 12.1022 21.5682M12.1759 21.6024C12.5122 21.7697 12.8629 21.8813 13.1926 21.9685M12.1022 21.5682C12.1001 21.4989 12.1122 21.4633 12.1195 21.4495L12.1199 21.4488C12.1198 21.4488 12.1197 21.449 12.1195 21.4495C12.1181 21.4518 12.1131 21.4598 12.1028 21.4703C12.0899 21.4836 12.0726 21.497 12.0517 21.5077C12.0097 21.5292 11.9786 21.5276 11.9786 21.5276L11.9787 21.5276C11.9821 21.5278 12.0022 21.5303 12.0428 21.5446C12.0614 21.5511 12.0812 21.559 12.1022 21.5682ZM13.1926 21.9685C14.5099 22.3205 16.0192 22.3343 17.3287 21.6633C17.3508 21.6522 17.3719 21.6409 17.3905 21.6305C17.3549 21.7674 17.2536 21.9338 17.1198 22.0708L17.1194 22.0713C17.1193 22.0713 17.1139 22.0764 17.0931 22.094C17.091 22.0959 17.0886 22.0979 17.0859 22.1001C17.0669 22.1161 17.0361 22.1421 17.0069 22.1693C16.9483 22.224 16.8163 22.3533 16.7659 22.5549L16.7511 22.6146V22.6761C16.7511 22.7678 16.7636 22.8552 16.7839 22.9357C16.8102 23.0774 16.8185 23.1288 16.814 23.1765C16.8128 23.1787 16.8105 23.1826 16.8065 23.1883C16.7985 23.1998 16.786 23.2156 16.7646 23.2395C16.7486 23.2574 16.7341 23.2729 16.7155 23.2928C16.706 23.3028 16.6955 23.314 16.6833 23.3272L16.6829 23.3275C16.6039 23.4127 16.5163 23.5266 16.4707 23.6852C16.4283 23.8324 16.4371 23.9699 16.4459 24.0637L16.4459 24.0637L16.4462 24.0667C16.4484 24.0886 16.4504 24.1083 16.4522 24.1262C16.4601 24.2029 16.4645 24.2464 16.4641 24.2914C16.4638 24.3311 16.459 24.3507 16.4529 24.3656C16.4299 24.4157 16.398 24.4549 16.3343 24.5042C16.3028 24.5281 16.2792 24.5444 16.2486 24.5654C16.2267 24.5805 16.2012 24.598 16.1667 24.6225C16.1356 24.6417 16.0965 24.6594 16.0135 24.6965L16.0114 24.6974C15.9361 24.7311 15.8151 24.7852 15.7002 24.8691C15.7003 24.869 15.7004 24.869 15.7004 24.8689L13.1926 21.9685ZM13.1926 21.9685C13.1923 21.9684 13.1921 21.9683 13.1919 21.9683L13.321 21.4853M13.1926 21.9685C13.1928 21.9685 13.193 21.9686 13.1932 21.9686L13.321 21.4853M13.1926 21.9685L13.321 21.4853"
                    fill="#78A3AD"
                    stroke="#27251F"
                  />
                </svg>

                <span class={styles["parent-title"]}>
                  {obj.parentNode.name}
                </span>
              </div>

              {obj.answers?.map(
                (answer, ansIdx) => (
                  // answer.answered &&
                  // answer.hasKeyword &&
                  // filter[answer.category] ? (
                  <div
                    className={styles["answer-container"]}
                    hidden={
                      !(
                        answer.answered &&
                        answer.hasKeyword &&
                        filter[answer.category]
                      )
                    }
                  >
                    <div className={styles["answer-user"]}>
                      <span>
                        {obj.userName} {obj.lastEditTime.str}
                      </span>
                    </div>
                    <div
                      className={styles["category-row"]}
                      onClick={() => handleExpand(index, ansIdx)}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="6.5"
                          cy="6.5"
                          r="6"
                          fill={colors[answer.category]}
                          stroke="#27251F"
                        />
                      </svg>
                      <span style={{ cursor: "pointer" }}>
                        {tab == "Categories"
                          ? answer.category
                          : answer.question}
                      </span>
                    </div>
                    <div
                      className={styles["content"]}
                      hidden={answer.expanded ? false : true}
                    >
                      <span className="test" id={`${index}-${ansIdx}`}>
                        {search == "" ? answer.answer : ""}
                      </span>
                    </div>
                    {/* <p>{answer.assignee}</p> */}
                    {/* <p>{answer.evidence}</p> */}
                  </div>
                )
                // ) : null
              )}
            </div>
            <Divider />
            <VerticalSpace space="small" />
            <Button
              onClick={() => handleDeleteButtonClick(index, obj.widgetId)}
            >
              Delete
            </Button>
          </div>
        )
        // ) : null
      )}

      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
