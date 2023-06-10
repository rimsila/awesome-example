import { StatisticCard } from "@ant-design/pro-components";

const { Divider } = StatisticCard;

export default () => {
  return (
    <StatisticCard.Group size="small" bordered>
      <StatisticCard
        size="small"
        statistic={{
          title: "全部",
          value: 10,
        }}
      />
      <Divider />
      <StatisticCard
        size="small"
        statistic={{
          title: "未发布",
          value: 5,
          status: "default",
        }}
      />
    </StatisticCard.Group>
  );
};
