class Solution:
    def change(self, amount: int, coins: list[int]) -> int:

        dp = [0] * (amount + 1)
        print(dp)
        dp[0] = 1
        for coin in coins:
            for i in range(coin, amount + 1):
                dp[i] += dp[i - coin]
        print(dp)
        return dp[amount]
c = Solution()
print(c.change(5, [1, 2, 5]))  # Output should be 4