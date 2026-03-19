*port_breeze_arrival
    ; キャラクター定義
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]
    [chara_new name="sabrina" jname="サブリナ"]
    [chara_new name="ruria" jname="ルリア"]
    [chara_new name="hauhet" jname="ハウヘト"]

    ; フェニーは表示されている状態
    [bg storage="bg_town" time="1000"]
    [playbgm storage="cafe" loop="true"]
    #
    君は、フェニーと共にとりま突発でポートブリーズに向かうことにした。
    [p]

    #フェニー
    サブリナにチョコを渡したくて、[br]その為の器材や材料が買いたいんだよ！[br]どっちを先に買いに行ったほうがいいかな？
    [l]
    [p]

    ; 選択肢
    [link target="*buy_equipment_route" text="器材を買いに行く"]
    [link target="*buy_ingredients_route" text="材料を買いに行く"]
    [r]
    [s]


; ----- 材料ルート -----
*buy_ingredients_route
    [chara_hide name="fenny" time="200" wait="true"]
    [bg storage="bg_market" time="1000"]
    [chara_show name="sabrina" storage="sabrina_normal" pos="center"] 
    #サブリナ
    お、フェニー！団長と買い物？
    [p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" storage="fenny_normal" pos="center"] 
    #フェニー
    ま、まずいんだよ！[br]サブリナにチョコを渡す計画がバレちゃうんだよ！[br]団長さん！なんとかしてぇ！
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" storage="sabrina_normal" pos="center"]
    #サブリナ
    なーにをこそこそと相談してるんだい？
    [p]
    聞かせなさい！
    [p]
    #
    このままでは計画がバレてしまう...
    [p]
    君は...
    [p]

    ; 選択肢
    [link target="*ingredients_deceive" text="ごまかす！"]
    [link target="*ingredients_leave_to_fenny_badend" text="フェニーにまかせる！"]
    [r]
    [s]

*ingredients_leave_to_fenny_badend
    [chara_hide name="sabrina" time="200" wait="true"]
    [chara_show name="fenny" storage="fenny_normal" pos="left"]
    #フェニー
    ふぇぇ！?なんとかして欲しいのは[br]フェニーの方なんだよ！？[br]で、でも、団長さんがいうなら、[br]なんとかしてみるんだよ！
    [p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" storage="sabrina_normal" pos="right"]
    #サブリナ
    何か悩みがあるならなんでも言って。
    [p]
    ようやく一緒にいられるんだから...
    [p]
    
    #フェニー
    サブリナ！[br]実はその...団長さんとデート中なんだよ！
    [p]
    
    [stopbgm] 
    
    #サブリナ
    は！？
    [p]
    
    #フェニー
    だから...その...邪魔しないで欲しいんだよ！！！
    [p]
    
    #サブリナ
    団長...。どういうこと？[br]ちょっとあっちで"お話"しようか...
    [p]
   
    #フェニー
    あ、、あれ？なんか不穏なんだよ...？
    [p]
    [chara_hide name="fenny" time="200" wait="true"]
    #
    その後、君の行方を知るものは誰もいなかった...
    [p]
    ～バッドエンド～
    [l]
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]

*ingredients_deceive
    [chara_hide name="sabrina" time="200" wait="true"]
    [bg storage="bg_sandalphon_cafe" time="1000"]
    なんとかサブリナをごまかし、退散することができた君たちは、カフェのキッチンでチョコの制作に取り掛かった。
    [p]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    〜♪〜♪サブリナ喜んでくれるかなぁ？
    [p]
    #
    金色に輝くボウルを混ぜながら、チョコを作るフェニー。
    [p]
    見守っていると、自然と口元が綻んでくる。
    [p]
    すると...
    [p]

    #フェニー
    ああーーーーー！！！
    [p]
    チョコが、チョコがなくなってるんだよ！！？
    [p]
   

    [chara_show name="ruria" storage="ruria_normal" pos="right"]
    #ルリア
    え、ええーーー！！
    [p]
    ソ、ソンナ、イッタイダレガー！
    [p]
    #
    あからさまに動揺しているルリア。
    [p]
    まさかこれは...
    [p]
   

    [chara_show name="fenny" storage="fenny_normal" pos="left"]
    #フェニー
    ...ルリア？ルリアなんだよ？
    [p]
　　　#ルリア
    ち、違います！[br]私じゃありません！話を聞いて下さい！
    [p]
    #
    どうやら証言を聞く必要があるようだ。
    [p]
    君はルリアの証言を聞くことにした。
    [p]

    ; 裁判シーンへの導入
    [playbgm storage="bgm_action" loop="true"] 
    これよりチョコ裁判議論が始まります。
    [p]
    証言者達は次々と証言をするので、[br]おかしな証言を「指摘」しましょう。
    [p]
    指摘は【】で囲われている証言をタップする事で行えます。
    [p]
    正しい証言の正しい選択肢を選ぶ事で【論破】することができます。
    [p]
    時間内に論破できなければバッドエンドです。
    [p]
    また、疑問の選択肢を選ぶことで、証言の内容が変わったり、[br]新たな情報を得ることができます。
    [p]
    フェニーのチョコを食べたのは誰か...？[br]貴方様の手で真相を見つけ出してください...
    [p]
     [er]
    [chara_hide name="fenny" time="500" wait="true"]
    [jump storage="TrialScene" params="{ layoutDataKey: 'trial_ch1' }"]
    [s]
   

; ----- 器材ルート -----
*buy_equipment_route
    [chara_hide name="fenny" time="200" wait="true"]
    [bg storage="bg_market" time="1000"]
    君は先に器材を買いに行くことにした。
    [p]

    [chara_show name="hauhet" storage="hauhet_normal" pos="center"]
    #ハウヘト
    あら...特異点。あなたも買い物？
    [p]
    

    [chara_show name="fenny" storage="fenny_normal" pos="left"]
    #フェニー
    ハウヘト！ハウヘトも買い物なんだよ？
    [p]
   
    #ハウヘト
    えぇ、ここの店はポートブリーズでも特に質が良いの。
    [p]
    この店にはよく来るから、
    [p]
    何か聞きたいことがあればアドバイスできると思うわよ？
    [p]
   
    #フェニー
    団長さん！
    [p]
    ハウヘトなら色々目利きが効くかもなんだよ！
    [p]
    買い物のアドバイスしてもらおう？
    [l]
    #
    ; 選択肢
    [link target="*equipment_ask_hauhet_end" text="受ける"]
    [link target="*equipment_decline" text="受けない"]
    [r]
    [s]

*equipment_ask_hauhet_end
    [chara_hide name="fenny" time="200" wait="true"]
    [chara_show name="hauhet" storage="hauhet_normal" pos="center"]
    #ハウヘト
    チョコを手作りするのね。
    [p]
    そうね、ならやはりボウルとヘラは妥協出来ないわ。
    [p]
    熱伝導効率を最大に高めるためにはこのヒヒイロボウル！
    [p]
    これは良いものよ...。
    [p]
    ヒヒイロカネはその希少性から市場にほぼ出回ることはないわ。[br]だからこそそれを贅沢に使ったこのヒヒイロボウルは...[br]
    [p]
    [chara_hide name="hauhet" time="200" wait="true"]
    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    なんか...すっごい早口で何言ってるか全然わかんないんだよ...
    [p]
    [chara_hide name="fenny" time="200" wait="true"]
    #
    その後、閉店時間まで延々とハウヘトの講釈を聞く羽目になった...[br]チョコ作りは当然間に合わなかった。
    [p]
   
    ～ハウヘトEND～
    [p]
   [er]
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]

*equipment_decline
  [chara_hide name="hauhet" time="200" wait="true"]
    [bg storage="bg_sandalphon_cafe" time="1000"]
    なんとかハウヘトの蘊蓄講座から抜け出し、退散することができた君たちは、カフェのキッチンでチョコの制作に取り掛かった。
    [p]

    [chara_show name="fenny" storage="fenny_normal" pos="center"]
    #フェニー
    〜♪〜♪サブリナ喜んでくれるかなぁ？
    [p]
    #
    金色に輝くボウルを混ぜながら、チョコを作るフェニー。
    [p]
    見守っていると、自然と口元が綻んでくる。
    [p]
    すると...
    [p]

    #フェニー
    ああーーーーー！！！
    [p]
    チョコが、チョコがなくなってるんだよ！！？
    [p]
   

    [chara_show name="ruria" storage="ruria_normal" pos="right"]
    #ルリア
    え、ええーーー！！
    [p]
    ソ、ソンナ、イッタイダレガー！
    [p]
    #
    あからさまに動揺しているルリア。
    [p]
    まさかこれは...
    [p]
   

    [chara_show name="fenny" storage="fenny_normal" pos="left"]
    #フェニー
    ...ルリア？ルリアなんだよ？
    [p]
　　　#ルリア
    ち、違います！[br]私じゃありません！話を聞いて下さい！
    [p]
    #
    どうやら証言を聞く必要があるようだ。
    [p]
    君はルリアの証言を聞くことにした。
    [p]

    ; 裁判シーンへの導入
    [playbgm storage="bgm_action" loop="true"] 
    これよりチョコ裁判議論が始まります。
    [p]
    証言者達は次々と証言をするので、[br]おかしな証言を「指摘」しましょう。
    [p]
    指摘は【】で囲われている証言をタップする事で行えます。
    [p]
    正しい証言の正しい選択肢を選ぶ事で【論破】することができます。
    [p]
    時間内に論破できなければバッドエンドです。
    [p]
    また、疑問の選択肢を選ぶことで、証言の内容が変わったり、[br]新たな情報を得ることができます。
    [p]
    フェニーのチョコを食べたのは誰か...？[br]貴方様の手で真相を見つけ出してください...
    [p]
     [er]
    [chara_hide name="fenny" time="500" wait="true"]
    [jump storage="TrialScene" params="{ layoutDataKey: 'trial_ch1' }"]
    [s]