function updateHTML() {
    //Globals
    DOMCacheGetOrSet('moneyText').textContent = `$${format(data.money)}`
    DOMCacheGetOrSet('chickensText').textContent = `Chickens: ${format(data.chickens)}`
    if(DOMCacheGetOrSet('currentEggImgHeader').getAttribute('src') !== `Imgs/${eggData[data.currentEgg].id}.png`) 
        DOMCacheGetOrSet('currentEggImgHeader').setAttribute('src', `Imgs/${eggData[data.currentEgg].id}.png`)
    DOMCacheGetOrSet('eggPromoteButton').classList = data.money.gte(eggData[data.currentEgg].unlockReq) ? 'unlocked' : 'locked'
    DOMCacheGetOrSet('eggPromoteButton').style.display = data.currentEgg >= eggData.length-1 || contractActive() ? 'none' : 'inline-block'
    const previousEggUnlockReq = data.currentEgg !== 0 ? eggData[data.currentEgg - 1].unlockReq.max(1.01) : D(1.01)
    const currentEggUnlockReq = eggData[data.currentEgg].unlockReq.max(1.02)
    const lastEggUnlockProgress = data.money.max(1).log10().div(previousEggUnlockReq.log10())
    const nextEggUnlockProgress = data.money.div(previousEggUnlockReq).max(1).log10().div(currentEggUnlockReq.div(previousEggUnlockReq).log10())
    DOMCacheGetOrSet('eggPromoteButton').style.setProperty("--y", lastEggUnlockProgress.mul(100).max(0).min(100).toString() + '%')
    DOMCacheGetOrSet('eggPromoteButton').style.setProperty("--x", nextEggUnlockProgress.mul(100).max(0).min(100).toString() + '%')
    DOMCacheGetOrSet('prestigeTabButton').style.display = data.hasPrestiged === true ? 'block' : 'none'
    DOMCacheGetOrSet('prestigeButton').classList = data.currentEgg < 3 ? 'locked' : 'prestigeHeader'
    DOMCacheGetOrSet('prestigeButton').style.display = contractActive() ? 'none' : 'block'
    DOMCacheGetOrSet('prestigeButton').textContent = data.currentEgg < 3 ? 'Reach Rocket Fuel Eggs' : `Prestige: +${format(soulEggGain)} Soul Eggs`
    DOMCacheGetOrSet('newsHolder').style.display = data.settingsToggles[1] ? 'block' : 'none'
    if(data.currentTab === 0) {
        updateEggPage()
    }
    else if(data.currentTab === 1) {
        for(let i = 0; i < commonResearchCost.length; i++)
            if(data.research[i].lt(commonResearchMaxLevel[i]))
                DOMCacheGetOrSet(`r${i}`).classList = data.money.gte(commonResearchCost[i]) ? 'unlockedResearch' : 'lockedResearch'
            else
                DOMCacheGetOrSet(`r${i}`).classList = 'maxedResearch'
        for(let i = 0; i < commonResearchNames.length; i++) {
            DOMCacheGetOrSet(`r${i}`).innerHTML = data.research[i].lt(commonResearchMaxLevel[i]) ? `${commonResearchNames[i]}<br>${commonResearchDescs[i]}<br>Level: ${format(data.research[i],0)}/${format(commonResearchMaxLevel[i],0)}<br>
            Cost: $${format(commonResearchCost[i])}` : `${commonResearchNames[i]}<br>${commonResearchDescs[i]}<br>Level: ${format(data.research[i],0)}/${format(commonResearchMaxLevel[i],0)}<br>
            Cost: [MAXED]`
        }
    }
    else if(data.currentTab === 2) {
        if(data.unlockedContracts === false && data.currentEgg >= 5)
            data.unlockedContracts = true
            if(data.generatedContracts === false && data.unlockedContracts === true){
                for(let i = 0; i < 3; i++) {
                    generateContract(i)
                }
                data.generatedContracts = true
            }
        DOMCacheGetOrSet('contractHiddenText').style.display = data.unlockedContracts === false ? 'block' : 'none'
        DOMCacheGetOrSet('contractHolder').style.display = data.unlockedContracts === true ? 'block' : 'none'
        if(data.unlockedContracts === true) {
            for(let i = 0; i < data.contracts.length; i++) {
                DOMCacheGetOrSet(`contract${i}Img`).setAttribute('src', data.contracts[i].image)
                DOMCacheGetOrSet(`contract${i}Header`).textContent = `Contract-0${i+1} | ${data.contracts[i].title}`
                DOMCacheGetOrSet(`contract${i}Description`).textContent = data.contracts[i].description
                DOMCacheGetOrSet(`contract${i}Reward`).textContent = `Reward: ${format(data.contracts[i].reward)} ${data.contracts[i].rewardType}`
                DOMCacheGetOrSet(`contract${i}Goal`).textContent = `Goal: $${format(data.contracts[i].goal)}`
                DOMCacheGetOrSet(`contract${i}Button`).textContent = data.contractActive[i] ? `Leave Contract` : `Start Contract`
            }
        }
    }
    else if(data.currentTab === 3) {
        DOMCacheGetOrSet(`setTog0`).innerHTML = data.settingsToggles[0] ? `Notation: Mixed Sci` : `Notation: Sci`
        DOMCacheGetOrSet(`setTog1`).innerHTML = data.settingsToggles[1] ? `Newsticker: On` : `Newsticker: Off`
    }
    else if(data.currentTab === 4) {
        DOMCacheGetOrSet('soulEggText').innerHTML = `Soul Eggs: ${format(data.soulEggs)}<br>Best Soul Eggs: ${format(data.bestSoulEggs)}<br>Earnings Boost: x${format(soulEggBoost)}`
        DOMCacheGetOrSet('prophecyEggText').innerHTML = `Prophecy Eggs: ${format(data.prophecyEggs)}<br>Soul Boost: x${format(prophecyEggBoost)}`
        for(let i = 0; i < epicResearchCost.length; i++)
            if(data.epicResearch[i].lt(epicResearchMaxLevel[i]))
                DOMCacheGetOrSet(`er${i}`).classList = data.soulEggs.gte(epicResearchCost[i]) ? 'prestige' : 'lockedResearch'
            else
                DOMCacheGetOrSet(`er${i}`).classList = 'maxedResearch'
        for(let i = 0; i < epicResearchNames.length; i++) {
            DOMCacheGetOrSet(`er${i}`).innerHTML = data.epicResearch[i].lt(epicResearchMaxLevel[i]) ? `${epicResearchNames[i]}<br>${epicResearchDescs[i]}<br>Level: ${format(data.epicResearch[i],0)}/${format(epicResearchMaxLevel[i],0)}<br>
            Cost: ${format(epicResearchCost[i])} Soul Eggs` : `${epicResearchNames[i]}<br>${epicResearchDescs[i]}<br>Level: ${format(data.epicResearch[i],0)}/${format(epicResearchMaxLevel[i],0)}<br>
            Cost: [MAXED]`
        }
    }
}
